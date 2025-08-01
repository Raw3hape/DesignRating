import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// Инициализируем Stripe только если есть ключ
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
      // Демо режим без реального Stripe
      return NextResponse.json({
        success: true,
        sessionId: 'demo_session_id'
      })
    }

    // Создаем Checkout Session
    const session = await stripe!.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Анализ дизайна',
              description: 'Профессиональная оценка ваших дизайнерских работ',
            },
            unit_amount: 99, // $0.99 в центах
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
    console.error('Ошибка создания платежной сессии:', error)
    return NextResponse.json(
      { error: 'Ошибка при создании платежной сессии' },
      { status: 500 }
    )
  }
}

// Webhook для обработки событий Stripe
export async function PUT(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature') as string

    if (!process.env.STRIPE_WEBHOOK_SECRET || !signature) {
      return NextResponse.json(
        { error: 'Webhook не настроен' },
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
        
        // Здесь можно сохранить информацию о платеже в базу данных
        console.log('Платеж успешно завершен:', session.id)
        
        // Можно отправить email с подтверждением
        // await sendPaymentConfirmation(session.customer_email)
        
        break
        
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent
        console.log('Платеж не прошел:', failedPayment.id)
        break
        
      default:
        console.log(`Необработанное событие: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Ошибка webhook:', error)
    return NextResponse.json(
      { error: 'Ошибка webhook' },
      { status: 400 }
    )
  }
}