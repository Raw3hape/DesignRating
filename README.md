# DesignRating

AI-powered design evaluation platform that helps designers get professional feedback on their work.

## Features

- Upload 3-6 design works for analysis
- Get a score from 1-100 with detailed feedback
- Color-coded scoring system
- 3 free analyses, then $0.99 per analysis
- Share results on social media
- See how you rank against other designers

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/yourusername/designrating.git
cd designrating
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with:
```env
OPENAI_API_KEY=your_openai_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- OpenAI GPT-4 Vision API
- Stripe for payments

## License

MIT