# PropelSense Frontend

A modern dashboard built with Next.js, TypeScript, and shadcn/ui.

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **FastAPI Backend** - Python backend (separate project)

## Getting Started

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utilities
│   └── utils.ts          # Helper functions
├── .env.local            # Environment variables (not in git)
└── package.json          # Dependencies
```

## Adding Components

Add shadcn/ui components:

```bash
npx shadcn@latest add <component-name>
```

Examples: `button`, `card`, `input`, `form`, `dialog`, `table`, etc.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
