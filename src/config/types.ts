import type { Budgets, Category } from '@/features/budgets/domain/category'

/** Brand color as HSL triplets ("221 83% 53%") so they slot into `hsl(var(--token))`. */
export interface BrandPalette {
  primary: string
  primaryForeground: string
}

export interface BrandContact {
  legalName?: string
  email?: string
  phoneDisplay?: string
  phoneHref?: string
  address?: string
  mapsUrl?: string
  website?: string
}

export interface BrandConfig {
  name: string
  tagline: string
  /** Optional logo; when absent the UI shows the name. */
  logoUrl?: string
  palette: BrandPalette
  /** BCP-47 locale, e.g. "es-MX". Drives number and date formatting. */
  locale: string
  /** ISO 4217 code, e.g. "MXN". */
  currency: string
  contact: BrandContact
}

/** One example expense, placed within its month at position `at` (0 = 1st day, 1 = last available day). */
export interface SeedItem {
  categoryId: string
  amount: number
  description: string
  at: number
}

export interface DemoSeed {
  previousMonth: SeedItem[]
  currentMonth: SeedItem[]
}

export interface PresupuestoConfig {
  /** Prefix for localStorage keys, lets several demos share one browser. */
  storageNamespace: string
  /** Spending at or above this percent of budget is a warning; above 100% is exceeded. */
  warningPercent: number
  categories: readonly Category[]
  defaultBudgets: Budgets
  admin: {
    /** DEMO ONLY: password for the admin gate in demo mode (not real security). */
    demoPassword: string
    showDemoHint: boolean
  }
  demoSeed: DemoSeed
}
