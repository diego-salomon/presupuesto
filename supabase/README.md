# Supabase setup (live mode)

Demo mode needs none of this. Follow it only to run Presupuesto on a real
backend (`VITE_MODE=live`).

## 1. Create the schema

Either paste [`schema.sql`](schema.sql) into the Supabase **SQL editor** and run
it, or, with the Supabase CLI linked to your project:

```bash
supabase db push
```

This creates the `budgets` and `expenses` tables with Row Level Security enabled
and policies that scope every row to the signed-in user.

## 2. Create the admin user

Supabase Auth is the admin login. In the dashboard, **Authentication → Users →
Add user**, create one email/password user. That user's email + password is what
you type on the app's `/admin` screen.

> This template is single-tenant: one deployment per client, and every row is
> private to the signed-in user. To let several staff share one dataset, have
> them use the same login, or add a `tenant_id` column + tenant-scoped policies.

## 3. Point the app at the project

```bash
cp .env.example .env
```

```bash
VITE_MODE=live
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-ANON-KEY
```

Find both values in **Project Settings → API**. Then `pnpm build` and deploy the
static `dist/` folder.

## Notes

- Categories are defined in the app config (`src/config/presupuesto.config.ts`),
  not in the database — keep category ids stable once a client has real data.
- Amounts are whole currency units (integers); the schema enforces `amount > 0`.
- There is no public/anon data access: without a session, every query returns
  nothing by RLS.
