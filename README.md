# PropelSense — Frontend

Frontend for PropelSense, a ship propulsion intelligence platform. Built with Next.js 16, TypeScript, and Tailwind CSS v4.

## Tech Stack

| Technology          | Purpose                                        |
| ------------------- | ---------------------------------------------- |
| **Next.js 16**      | React framework with App Router                |
| **TypeScript**      | Type-safe JavaScript                           |
| **Tailwind CSS v4** | Utility-first styling                          |
| **shadcn/ui**       | UI component library                           |
| **Supabase**        | Authentication (email/password + Google OAuth) |
| **Recharts**        | Data visualisation charts                      |
| **Leaflet**         | Interactive vessel traffic map                 |
| **Axios**           | HTTP client for API communication              |

## Features

- **Power Prediction** — Enter vessel and environmental parameters to get an instant shaft power estimate
- **Sea Trial Dashboard** — Full CRUD management for sea trials with auto-calculated compliance scores and ML prediction integration
- **Ocean Analytics** — Live marine weather data (waves, current, SST, 48hr forecasts) from Open-Meteo Marine API
- **Vessel Traffic Map** — Interactive AIS map of Baltic and North Sea vessel positions
- **Prediction History** — Full audit trail of all prediction runs, filterable and re-runnable
- **Propulsion Monitoring** — Time-series charts for RPM, torque, and shaft power
- **PDF Reports** — Auto-generated sea trial and prediction summary reports
- **Authentication** — Email/password and Google OAuth via Supabase

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Build for Production

```bash
npm run build
npm run start
```

## Project Structure

```
frontend/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   ├── dashboard/                # Main dashboard
│   ├── login/                    # Auth pages
│   ├── register/
│   ├── forgot-password/
│   ├── reset-password/
│   ├── auth/callback/            # Supabase OAuth callback
│   └── components/
│       ├── StatsCards.tsx
│       ├── WeatherWidget.tsx
│       └── charts/               # Recharts wrappers
├── components/
│   └── ui/                       # shadcn/ui components
├── lib/
│   ├── auth/                     # Supabase auth context
│   ├── services/                 # API service layer
│   ├── types/                    # TypeScript types
│   ├── data/                     # Static/sample data
│   └── constants/
├── public/                       # Static assets
└── package.json
```

## Adding shadcn/ui Components

```bash
npx shadcn@latest add <component-name>
```

## Deployment

Deployed on **Vercel**. Set the environment variables listed above in the Vercel project settings before deploying.

## API

This frontend communicates with the PropelSense FastAPI backend. See the [backend repository](../backend/README.md) for API documentation.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
