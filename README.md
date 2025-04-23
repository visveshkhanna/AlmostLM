# AlmostLM

A modern language model playground built with Next.js, featuring advanced AI capabilities and a beautiful UI.

## Tech Stack

### Core Technologies
- **Framework**: [Next.js](https://nextjs.org) 15.3.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Prisma 6.6.0
- **Authentication**: Clerk
- **Vector Database**: Upstash Vector

### AI & ML
- OpenAI SDK
- LangChain
- FAL.ai Client
- PDF Processing (pdf-parse, pdf2json)

### UI Components
- Radix UI (Complete component library)
- Framer Motion (Animations)
- React Query (Data fetching)
- React Table (Data tables)
- Recharts (Charts)
- React Markdown (Markdown rendering)
- LaTeX Support (react-latex-next)

### Development Tools
- ESLint
- Prettier
- TypeScript
- Prisma (Database ORM)

## Getting Started

### Prerequisites
- Node.js (Latest LTS version recommended)
- npm, yarn, pnpm, or bun
- OpenAI API key
- Clerk account (for authentication)
- Upstash Vector account

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/almostlm.git
cd almostlm
```

2. Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Set up environment variables
```bash
# Copy the sample environment file
cp .env.sample .env
```

Then edit the `.env` file and fill in the following required values:
```env
# Required
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
UPSTASH_VECTOR_ENDPOINT=your_upstash_vector_endpoint
UPSTASH_VECTOR_TOKEN=your_upstash_vector_token
DATABASE_URL=your_database_url

# Optional (depending on features you want to use)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_ACCESS_KEY_SECRET=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_BUCKET=your_aws_bucket_name
AWS_BUCKET_URL=your_aws_bucket_url
NOVITA_API_URL=your_novita_api_url
NOVITA_API_KEY=your_novita_api_key
FAL_KEY=your_fal_key
```

4. Run the development server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Keep the code clean and maintainable
- Ensure all dependencies are properly typed
- Follow the existing code style and patterns

### Code Style

- Use Prettier for code formatting
- Follow ESLint rules
- Write meaningful comments
- Keep components small and focused
- Use proper TypeScript types
- Follow the project's component structure

## License

This project is licensed under the MIT License - see the LICENSE file for details.
