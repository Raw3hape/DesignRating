import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// Initialize Stripe only if key exists
let stripe: Stripe | null = null

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-07-30.basil',
  })
}

export async function POST(request: NextRequest) {
  try {
    const { returnUrl } = await request.json()

    if (!process.env.STRIPE_SECRET_KEY) {
      // Demo mode without real Stripe
      return NextResponse.json({
        success: true,
        sessionId: 'demo_session_id'
      })
    }

    // Create Checkout Session
    const session = await stripe!.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Design Analysis',
              description: 'Professional evaluation of your design work',
            },
            unit_amount: 99, // $0.99 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${returnUrl}?success=true`,
      cancel_url: `${returnUrl}?canceled=true`,
      metadata: {
        type: 'design_analysis',
      },
    })

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url
    })

  } catch (error) {
    console.error('Error creating payment session:', error)
    return NextResponse.json(
      { error: 'Error creating payment session' },
      { status: 500 }
    )
  }
}

// Webhook for handling Stripe events
export async function PUT(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature') as string

    if (!process.env.STRIPE_WEBHOOK_SECRET || !signature) {
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 400 }
      )
    }

    const event = stripe!.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        
        // Here you can save payment information to database
        console.log('Payment completed successfully:', session.id)
        
        // Can send confirmation email
        // await sendPaymentConfirmation(session.customer_email)
        
        break
        
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent
        console.log('Payment failed:', failedPayment.id)
        break
        
      default:
        console.log(`Unhandled event: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook error' },
      { status: 400 }
    )
  }
}