-- Presupuesto — live-mode schema (Supabase / Postgres).
-- Single-tenant: one deployment per client, every row scoped to the signed-in
-- user via RLS. There is no public access; all reads/writes require a session.
--
-- Apply with the Supabase SQL editor, or `supabase db push` against your project.
-- Categories live in the app config (presupuesto.config.ts), not in the database.

-- ── Budgets: one row per category, per user ──────────────────────────────────
create table if not exists public.budgets (
  user_id     uuid    not null default auth.uid() references auth.users (id) on delete cascade,
  category_id text    not null,
  amount      integer not null check (amount > 0),
  updated_at  timestamptz not null default now(),
  primary key (user_id, category_id)
);

-- ── Expenses ─────────────────────────────────────────────────────────────────
create table if not exists public.expenses (
  id          uuid    primary key default gen_random_uuid(),
  user_id     uuid    not null default auth.uid() references auth.users (id) on delete cascade,
  category_id text    not null,
  amount      integer not null check (amount > 0),
  date        date    not null,
  description text    not null default '',
  created_at  timestamptz not null default now()
);

create index if not exists expenses_user_date_idx on public.expenses (user_id, date desc);

-- ── Row Level Security ───────────────────────────────────────────────────────
alter table public.budgets  enable row level security;
alter table public.expenses enable row level security;

-- Each user sees and writes only their own rows. Repeated for each table.
create policy "budgets are private to the user"
  on public.budgets for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "expenses are private to the user"
  on public.expenses for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
