import type { Clock } from '@/shared/domain/clock'
import type { IdGenerator } from '@/shared/domain/id'
import type { KeyValueStorage } from '@/shared/domain/storage'
import { SystemClock } from '@/shared/infrastructure/systemClock'
import { uuid } from '@/shared/infrastructure/uuid'
import { buildLocaleFormats, type LocaleFormats } from '@/shared/infrastructure/localeFormat'
import { makeCategoryIndex, type Budgets, type Category, type CategoryIndex } from '@/features/budgets/domain/category'
import type { BudgetRepository } from '@/features/budgets/domain/ports'
import type { ExpenseRepository } from '@/features/expenses/domain/ports'
import type { ExpenseValidationOptions } from '@/features/expenses/domain/validateExpense'
import type { AdminGate } from '@/features/admin/domain/ports'
import { LocalExpenseRepository } from '@/features/expenses/infrastructure/localExpenseRepository'
import { LocalBudgetRepository } from '@/features/budgets/infrastructure/localBudgetRepository'
import { DemoAdminGate } from '@/features/admin/infrastructure/demoAdminGate'
import { generateSeedExpenses } from '@/features/expenses/infrastructure/seed'
import { resetDemoData } from '@/features/admin/application/resetDemoData'
import { getSupabaseClient } from '@/infrastructure/supabase/client'
import { SupabaseExpenseRepository } from '@/features/expenses/infrastructure/supabaseExpenseRepository'
import { SupabaseBudgetRepository } from '@/features/budgets/infrastructure/supabaseBudgetRepository'
import { SupabaseAdminGate } from '@/features/admin/infrastructure/supabaseAdminGate'
import type { BrandConfig, PresupuestoConfig } from '@/config/types'

export type RunMode = 'demo' | 'live'

export interface Container {
  mode: RunMode
  brand: BrandConfig
  categories: readonly Category[]
  defaultBudgets: Budgets
  warningPercent: number
  formats: LocaleFormats
  categoryIndex: CategoryIndex
  validation: ExpenseValidationOptions
  clock: Clock
  newId: IdGenerator
  expenses: ExpenseRepository
  budgets: BudgetRepository
  admin: AdminGate
  /** Demo password to show on the login screen as a hint, or undefined to hide it. */
  adminHint?: string
  /** Seed (demo) or hydrate from the backend (live). Awaited before first render. */
  boot(): Promise<void>
  /** Demo only: restore example data. No-op in live mode. */
  resetDemo(): void
}

export interface ContainerOptions {
  brand: BrandConfig
  config: PresupuestoConfig
  mode?: RunMode
  /** Injectable for tests; default to the browser globals. */
  localStorage?: KeyValueStorage
  sessionStorage?: KeyValueStorage
  clock?: Clock
  newId?: IdGenerator
}

function resolveMode(explicit?: RunMode): RunMode {
  return explicit ?? (import.meta.env.VITE_MODE === 'live' ? 'live' : 'demo')
}

export function createContainer(options: ContainerOptions): Container {
  const { brand, config } = options
  const mode = resolveMode(options.mode)
  const clock = options.clock ?? new SystemClock()
  const newId = options.newId ?? uuid

  const formats = buildLocaleFormats(brand.locale, brand.currency)
  const categoryIndex = makeCategoryIndex(config.categories)
  const validation: ExpenseValidationOptions = { isCategoryId: categoryIndex.isCategoryId, money: formats.money }

  const base = {
    mode,
    brand,
    categories: config.categories,
    defaultBudgets: config.defaultBudgets,
    warningPercent: config.warningPercent,
    formats,
    categoryIndex,
    validation,
    clock,
    newId,
    adminHint: mode === 'demo' && config.admin.showDemoHint ? config.admin.demoPassword : undefined,
  }

  if (mode === 'live') {
    return buildLive(base, config)
  }
  return buildDemo(base, config, {
    localStorage: options.localStorage ?? window.localStorage,
    sessionStorage: options.sessionStorage ?? window.sessionStorage,
  })
}

type Base = Omit<Container, 'expenses' | 'budgets' | 'admin' | 'boot' | 'resetDemo'>

function buildDemo(
  base: Base,
  config: PresupuestoConfig,
  stores: { localStorage: KeyValueStorage; sessionStorage: KeyValueStorage },
): Container {
  const ns = config.storageNamespace
  const keys = {
    expenses: `${ns}.expenses`,
    budgets: `${ns}.budgets`,
    admin: `${ns}.admin-unlocked`,
    seeded: `${ns}.seeded`,
  }

  const expenses = new LocalExpenseRepository({
    storage: stores.localStorage,
    key: keys.expenses,
    isCategoryId: base.categoryIndex.isCategoryId,
    makeSeed: () => generateSeedExpenses(config.demoSeed, base.clock, base.newId),
  })
  const budgets = new LocalBudgetRepository({
    storage: stores.localStorage,
    key: keys.budgets,
    categories: config.categories,
    defaultBudgets: config.defaultBudgets,
  })
  const admin = new DemoAdminGate({ storage: stores.sessionStorage, key: keys.admin, password: config.admin.demoPassword })

  const resetDemo = () => resetDemoData({ expenses, budgets, defaultBudgets: config.defaultBudgets })

  return {
    ...base,
    expenses,
    budgets,
    admin,
    resetDemo,
    boot: () => {
      // Seed once, on first ever load. After that we respect the user's data,
      // even if they delete everything (so a cleared demo stays cleared).
      if (stores.localStorage.getItem(keys.seeded) !== '1') {
        expenses.resetToSeed()
        stores.localStorage.setItem(keys.seeded, '1')
      }
      return Promise.resolve()
    },
  }
}

function buildLive(base: Base, config: PresupuestoConfig): Container {
  const sb = getSupabaseClient()
  const expenses = new SupabaseExpenseRepository(sb)
  const budgets = new SupabaseBudgetRepository(sb, config.categories, config.defaultBudgets)
  const admin = new SupabaseAdminGate(sb)

  return {
    ...base,
    expenses,
    budgets,
    admin,
    resetDemo: () => {},
    boot: async () => {
      await Promise.all([expenses.hydrate(), budgets.hydrate(), admin.hydrate()])
    },
  }
}
