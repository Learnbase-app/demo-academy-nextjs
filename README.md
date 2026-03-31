# LearnBase Academy Demo (Next.js)

This is a modern Next.js template demonstrating how to build a custom frontend for a LearnBase-powered academy. It uses the App Router, Server Actions, and Tailwind CSS.

## Features

- **LearnBase Integration**: Connects directly to the LearnBase API to fetch courses, modules, lessons, and handle user authentication.
- **Next.js 16 App Router**: Built with the latest Next.js routing paradigms, React Server Components (RSC), and Server Actions.
- **Tailwind CSS v4**: Utility-first styling with shadcn/ui components.
- **Authentication**: Fully integrated session management using LearnBase backend services.

## Prerequisites

Before running this project, you need:
- Node.js installed (v18.17 or higher recommended).
- A LearnBase account and an active tenant/academy.
- An API Key from your LearnBase dashboard.

## Getting Started

1. **Clone the repository and install dependencies:**

   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

2. **Configure Environment Variables:**

   Copy the provided `.env.example` file to create a `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

   Fill in the required values in your `.env.local`:

   ```env
   # The Base URL for the LearnBase API
   LEARNBASE_API_BASE_URL=https://api.uselearnbase.com/v1

   # Your LearnBase API Key (from your dashboard)
   LEARNBASE_API_KEY=your_api_key_here

   # The unique slug of your LearnBase tenant
   LEARNBASE_TENANT_SLUG=your_tenant_slug_here
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/`: Next.js App Router pages (courses, checkout, account, learn).
- `components/`: UI components (built with shadcn/ui and Phosphor icons), split between purely `ui/` components and domain-specific `academy/` components.
- `lib/learnbase/`: LearnBase core integration, providing API clients, types, server actions, and session configuration.

## Commands

- `npm run dev` - Starts the development server with Turbopack.
- `npm run build` - Builds the app for production.
- `npm run start` - Starts the production server.
- `npm run lint` - Runs ESLint.
- `npm run format` - Formats the codebase with Prettier.
- `npm run typecheck` - Runs TypeScript type checking without emitting files.

## Built With

- [Next.js](https://nextjs.org/)
- [LearnBase](https://uselearnbase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [@base-ui/react](https://base-ui.com/)
- [Phosphor Icons](https://phosphoricons.com/)
