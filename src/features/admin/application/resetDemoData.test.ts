import { describe, expect, it } from 'vitest'
import { MemoryStorage } from '@/shared/infrastructure/memoryStorage'
import { FixedClock } from '@/shared/infrastructure/fixedClock'
import { makeCategoryIndex } from '@/features/budgets/domain/category'
import { LocalBudgetRepository } from '@/features/budgets/infrastructure/localBudgetRepository'
import { LocalExpenseRepository } from '@/features/expenses/infrastructure/localExpenseRepository'
import { generateSeedExpenses } from '@/features/expenses/infrastructure/seed'
import { presupuesto } from '@/config/presupuesto.config'
import { resetDemoData } from './resetDemoData'

const { categories, defaultBudgets, demoSeed } = presupuesto
const index = makeCategoryIndex(categories)

describe('resetDemoData', () => {
  it('restores default budgets and regenerates example expenses', () => {
    const storage = new MemoryStorage()
    let n = 0
    const expenses = new LocalExpenseRepository({
      storage,
      key: 'expenses',
      isCategoryId: index.isCategoryId,
      makeSeed: () => generateSeedExpenses(demoSeed, new FixedClock('2026-10-20'), () => `r-${++n}`),
    })
    const budgets = new LocalBudgetRepository({ storage, key: 'budgets', categories, defaultBudgets })

    budgets.set({ ...defaultBudgets, personal: 1 })

    resetDemoData({ expenses, budgets, defaultBudgets })

    expect(expenses.list().length).toBeGreaterThan(20)
    expect(budgets.get()).toEqual(defaultBudgets)
  })
})
