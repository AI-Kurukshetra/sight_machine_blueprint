# SightOps

SightOps is a production-oriented Next.js 16 App Router starter for a smart factory intelligence platform. It ships with:

- responsive manufacturing operations UI
- Supabase Auth integration using SSR-safe clients
- database schema and seed SQL
- local demo fallback so the app looks populated without credentials
- Vercel-ready environment variable setup
- gap-closure modules for connectors, multi-site visibility, and custom KPI building

## Stack

- Next.js App Router
- React 19
- TypeScript
- Supabase Auth + Postgres
- Plain CSS with design tokens

## Local setup

1. Use Node.js `20.9+`.
2. Install dependencies:

```bash
npm install
```

3. Copy `.env.example` to `.env.local` and set:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is also supported as a fallback alias.

4. Create a Supabase project and run the SQL files in order:

```text
supabase/schema.sql
supabase/seed.sql
```

5. Start development:

```bash
npm run dev
```

Without Supabase credentials, the app automatically renders local demo data so the experience is populated on first visit.

## Key routes

- `/` overview command center
- `/mobile` mobile operations dashboard
- `/sites` multi-site operations view
- `/connect` connector health and ingestion monitoring
- `/kpis` custom KPI builder + formula playground
- `/analytics`, `/anomalies`, `/quality`, `/spc` analytics and control modules
- `/planning`, `/optimization`, `/maintenance`, `/root-cause` execution + AI decision support
- `/inventory`, `/energy`, `/operators`, `/handover`, `/compliance`, `/genealogy` operations modules
- `/advanced` differentiating feature portfolio (12 advanced capabilities)
- `/advanced/[slug]` feature implementation views for each advanced capability
- `/innovation-lab` beyond-market innovation pipeline

## Auth

- `admin`, `plant_manager`, and `operator` roles are included in the schema.
- Sign up uses Supabase email/password auth.
- Email confirmation is wired to `/auth/confirm`.
- Admin-only modules are protected in UI and API: `/admin`, `/connect`, `/kpis`, `/optimization`, `/compliance`, `/advanced`, `/innovation-lab`.

To grant admin access after signup:

```sql
update public.profiles
set role = 'admin'
where id in (
  select id from auth.users where email = 'chaitali.darji@bacancy.com'
);
```

For email confirmation templates in Supabase, set the confirm signup URL to:

```text
{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
```

## Vercel

Set these project environment variables in Vercel:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Deploy with the default Next.js settings. No custom adapter is required.
