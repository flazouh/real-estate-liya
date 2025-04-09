# Real Estate Apartment Inquiry Form

A modern web application for managing apartment viewing requests. Built with Next.js, Tailwind CSS, and shadcn/ui components. The application includes a form that collects potential tenant information and sends it directly to a Telegram channel.

## Features

- Modern, responsive UI built with Tailwind CSS and shadcn/ui
- Form validation using Zod and React Hook Form
- Telegram integration for instant notifications
- Detailed apartment information display
- Mobile-friendly design

## Prerequisites

- Node.js 18+
- pnpm
- A Telegram bot token and channel ID

## Setup

1. Clone the repository:
   \`\`\`bash
   git clone <repository-url>
   cd real-estate-liya
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   pnpm install
   \`\`\`

3. Create a \`.env.local\` file in the root directory and add your Telegram credentials:
   \`\`\`env
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   TELEGRAM_CHAT_ID=your_chat_id_here
   \`\`\`

To get these credentials:

- Create a Telegram bot using [@BotFather](https://t.me/botfather) and get the token
- Add the bot to your channel and get the channel ID

## Development

Run the development server:

\`\`\`bash
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

The project is ready to be deployed on Vercel:

1. Push your code to a Git repository
2. Import the project in Vercel
3. Add the environment variables in Vercel's project settings
4. Deploy!

## Environment Variables

- \`TELEGRAM_BOT_TOKEN\`: Your Telegram bot token from @BotFather
- \`TELEGRAM_CHAT_ID\`: The ID of your Telegram channel where messages will be sent

## Tech Stack

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://github.com/colinhacks/zod)
- [Telegram Bot API](https://core.telegram.org/bots/api)
