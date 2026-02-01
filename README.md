# PPR Stats (Next.js)

Telemetry and session analytics for the Pale Panda Racing Team. Upload RaceBox CSVs, explore sessions and laps, compare performance, and visualize telemetry with charts and track maps.

## Features

- RaceBox CSV upload pipeline (sessions, laps, telemetry points)
- Session and lap analysis with charts and comparisons
- Track pages with stats and maps
- Authenticated dashboards and user profiles
- Supabase-backed auth, database, storage, and realtime channels

## Tech stack

- Next.js App Router + React 19
- Tailwind CSS v4 + shadcn/ui (Radix)
- Supabase (Auth/DB/Storage)
- Redux Toolkit + RTK Query
- Recharts + Google Maps integrations

## Project structure

- src/app: routes, layouts, route groups (public/protected), and API routes
- src/components: UI and feature components
- src/lib/data: server-side data helpers
- src/services: data access services for app features
- src/state: Redux store and RTK Query services
- supabase: migrations, seeds, and local config

## Local development

### Prerequisites

- Node.js 18+ (20+ recommended)
- Docker (for Supabase local)
- Supabase CLI (npx or global)

### Install dependencies

```bash
npm install
```

### Start Supabase locally

```bash
npx supabase start
```

Default local ports (from supabase/config.toml):

- API: http://127.0.0.1:54321
- DB: 54322
- Studio: http://127.0.0.1:54323

### Environment variables

Create a .env.local file at the repo root

```bash
cp .env.example .env.local
```

Open .env.local and include:

```bash
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=''
NEXT_PUBLIC_SUPABASE_URL=''
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=''
VERCEL_OIDC_TOKEN=''
```

For local Supabase, set:

- NEXT_PUBLIC_SUPABASE_URL to http://127.0.0.1:54321
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to the local anon/publishable key (see npx supabase status)

### Run the app

```bash
npm run dev
```

Open http://localhost:3000

## Database workflows

Apply migrations and reseed locally:

```bash
npx supabase db reset
```

Generate TypeScript types:

```bash
npm run supabase:types
```

## Upload workflow

Use the Upload page to submit RaceBox CSV files. The server will parse, aggregate laps, and store telemetry points in batches.

## Scripts

- dev: start Next.js dev server
- build: production build
- start: run production server
- lint: run ESLint
- supabase:types: generate Supabase types

## License

Proprietary – internal use only.
