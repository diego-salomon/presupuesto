# Presupuesto

White-label expense and budget tracker for small businesses. Log expenses by
category and see, at any point in the month, spend vs. monthly budget with early
warnings.

**[▶ Live demo](https://diego-salomon.github.io/presupuesto/)** — runs entirely
in the browser, no sign-up, no backend.

The same code runs two ways, selected by one env variable:

- **Demo mode** (`VITE_MODE=demo`, the default) — everything in the browser on
  `localStorage`, pre-seeded with example data. For sales demos and portfolio.
- **Live mode** (`VITE_MODE=live`) — a real [Supabase](https://supabase.com)
  backend (Postgres + Auth + Row Level Security).

Stack: React 19 · TypeScript (strict) · Vite · React Router 7 · Tailwind CSS 4 ·
Vitest + Testing Library · Playwright. Node 20+.

## Quick start

```bash
pnpm install
pnpm dev            # demo mode, http://localhost:5173
```

That's it — a full working demo on `localStorage`, no backend needed.

## Make it yours (white-label)

Everything client-specific lives in **two files**. No business name, color, or
string is hard-coded anywhere else.

- [`src/config/brand.config.ts`](src/config/brand.config.ts) — name, tagline,
  logo, palette (brand colors), **locale** and **currency** (these drive all
  number and date formatting), and contact details.
- [`src/config/presupuesto.config.ts`](src/config/presupuesto.config.ts) —
  categories, their default monthly budgets, the warning threshold, the demo
  admin password, and the example data.

Fill those two files (and the palette) and `pnpm dev` shows the client's full
working demo.

## Scripts

```bash
pnpm dev            # dev server (demo mode)
pnpm build          # typecheck + production build
pnpm test           # unit + integration tests (Vitest)
pnpm test:e2e       # end-to-end tests (Playwright; builds + serves first)
pnpm typecheck      # tsc, no emit
pnpm lint           # eslint
```

First E2E run only: `pnpm test:e2e:install` to download the browser.

## Live mode (Supabase)

1. Create a Supabase project and run [`supabase/schema.sql`](supabase/schema.sql)
   (see [`supabase/README.md`](supabase/README.md)).
2. Copy `.env.example` to `.env` and set:

   ```bash
   VITE_MODE=live
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=xxxx
   ```

3. Create a user in Supabase Auth — that's the admin login. `pnpm build` and deploy
   the `dist/` folder anywhere static.

All access is authenticated and RLS-scoped to the signed-in user; there is no
public data surface. This template is single-tenant (one deployment per client);
the schema comments note where a `tenant_id` would go for a shared deployment.

## Architecture

Clean architecture, feature-sliced. Dependencies point inward only:

```
src/
  config/        white-label config (brand + presupuesto) — the only files a client edits
  shared/        domain primitives (money, dates, Result), formatting, UI kit
  features/
    budgets/     budget status, monthly overview   ┐
    expenses/    expense validation, history, seed  │ each: domain / application /
    comparison/  previous-month comparison          │ infrastructure / ui
    admin/       admin gate, budget editing          ┘
    business-info/
  app/           composition root (container.ts), routing, React store wiring
  infrastructure/supabase/   Supabase client
```

- **domain/** — pure, fully unit-tested. No framework, no I/O.
- **application/** — use cases over the repository ports.
- **infrastructure/** — adapters behind those ports: `localStorage` (demo) and
  Supabase (live), chosen in `app/container.ts` by `VITE_MODE`.
- **ui/** — React components; read data through `useSyncExternalStore` hooks.

The backend seam is two small ports (`ExpenseRepository`, `BudgetRepository`);
swapping localStorage for Supabase changes no domain, application, or UI code.

## Testing

- **Vitest** covers the domain and application layers: status thresholds at their
  exact boundaries, monthly rollover isolation, input validation, history search,
  the seed story, and the repositories.
- **Playwright** covers the user flows: add expense → category total and status
  update, crossing 80% → warning, exceeding → red + alert, month-boundary
  isolation.

Design: mobile-first, WCAG AA, light + dark, reduced-motion, nothing clipped at
375px.

## Deployment (GitHub Pages)

The [live demo](https://diego-salomon.github.io/presupuesto/) is built and
published on every push to `main` by
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):

- the landing page ([`landing/`](landing/)) is served at the site root;
- the demo app is built with base `/presupuesto/demo/` and served under `/demo/`.

Demo mode needs no backend, so the whole thing is static. The router derives its
basename from Vite's base URL, so the same build runs at the domain root (dev)
and under a subpath (Pages).
