# RePlate

RePlate is a web-first food waste-to-value platform for restaurants, consumers, NGOs, and local operators. The current MVP is designed for a Nagpur pilot and focuses on fast surplus listing, self-pickup, donation rescue, and lightweight partner moderation.

## Live Preview

Preview deployment: [RePlate Demo Link](https://skill-deploy-ba6qc4r9cg-codex-agent-deploys.vercel.app)

## What This MVP Includes

- Role-based flows for restaurant, consumer, NGO, and admin
- Form-based signup and login
- Signup persistence to Supabase Postgres when `DATABASE_URL` is configured
- Safe local fallback when the database is not configured in the deployment environment
- Restaurant surplus listing flow
- Consumer reservation flow
- NGO donation claim flow
- Admin verification and pilot metrics
- Responsive UI with a branded RePlate logo and dashboard shell

## Current Auth Behavior

- `Sign up` collects `name`, `email`, `phone`, `area`, and `role`
- When `DATABASE_URL` is present, signup saves the user into your Supabase Postgres database table `replate_users`
- `Login` checks `email + role` against saved records
- If no database is configured, the app falls back to the in-memory demo store so preview deployments still work

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- PostgreSQL client via `pg`
- Supabase Postgres via `DATABASE_URL`

## Environment Variables

Set these locally and in Vercel Project Settings.

```env
NEXT_PUBLIC_APP_NAME=RePlate
NEXT_PUBLIC_SUPABASE_URL=SUPABASE_PUBLIC_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_REAL_SUPABASE_ANON_KEY
DATABASE_URL=SUPABASE_DATABASE_URL
```

Important:
- Replace `NEXT_PUBLIC_SUPABASE_ANON_KEY` with your real Supabase anon key
- The app currently uses `DATABASE_URL` for saving auth records server-side
- The public Supabase values are prepared for future client-side integrations

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Production / Vercel Setup

1. Import the project into Vercel or claim the existing preview deployment.
2. In Vercel Project Settings, add:
   - `NEXT_PUBLIC_APP_NAME`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `DATABASE_URL`
3. Redeploy after adding environment variables.
4. Test signup first, then login with the same email and role.

## Database Notes

On first use with `DATABASE_URL` configured, the app automatically ensures this table exists:

- `replate_users`

Stored fields:
- `id`
- `name`
- `email`
- `phone`
- `area`
- `role`
- `verification_status`
- `created_at`

## Known Product Boundaries

- Listings, reservations, and metrics are still MVP/demo data flows and are not yet persisted in Supabase
- User signup, login lookup, and admin verification are the parts now wired toward your database
- For a full production backend, the next step is moving listings and reservations out of the in-memory store and into Postgres as well

## Main Project Paths

- App shell: `app/layout.tsx`
- Auth UI: `app/auth/page.tsx`
- Auth signup API: `app/api/auth/signup/route.ts`
- Auth login API: `app/api/auth/login/route.ts`
- Users API: `app/api/users/route.ts`
- Admin verification API: `app/api/admin/verify-user/route.ts`
- Database config: `lib/db.ts`
- User repository: `lib/user-repository.ts`

## Build Check

```bash
npm run build
```
