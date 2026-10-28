import { describe, expect, it } from 'vitest'
import { YearMonth } from '@/shared/domain/yearMonth'
import { presupuesto } from '@/config/presupuesto.config'
import type { SpendEntry } from '../domain/spendEntry'
import { getMonthlyOverview } from './getMonthlyOverview'

const { categories, defaultBudgets, warningPercent } = presupuesto
const entry = (categoryId: string, amount: number, date: string): SpendEntry => ({ categoryId, amount, date })
const input = (expenses: SpendEntry[], budgets = defaultBudgets) => ({ budgets, expenses, categories, warningPercent })

describe('getMonthlyOverview', () => {
  const oct = YearMonth.of(2026, 10)

  it('returns every category with zero spending when there are no expenses', () => {
    const o = getMonthlyOverview(input([]), oct)
    expect(o.categories).toHaveLength(categories.length)
    expect(o.total).toBe(0)
    expect(o.categories.every((c) => c.status === 'ok' && c.spent === 0)).toBe(true)
  })

  it('only counts expenses of the requested month', () => {
    const o = getMonthlyOverview(
      input([
        entry('personal', 1000, '2026-10-05'),
        entry('personal', 2000, '2026-09-30'),
        entry('personal', 4000, '2025-10-05'),
        entry('servicios', 500, '2026-10-20'),
      ]),
      oct,
    )
    expect(o.categories.find((c) => c.categoryId === 'personal')?.spent).toBe(1000)
    expect(o.total).toBe(1500)
  })

  it('resets on the month boundary without deleting anything', () => {
    const data = [entry('insumos', 7000, '2026-10-31'), entry('insumos', 300, '2026-11-01')]
    expect(getMonthlyOverview(input(data), YearMonth.of(2026, 10)).total).toBe(7000)
    expect(getMonthlyOverview(input(data), YearMonth.of(2026, 11)).total).toBe(300)
  })

  it('uses the given budgets for any month and reports the total budget', () => {
    const budgets = { ...defaultBudgets, servicios: 10000 }
    const o = getMonthlyOverview(input([entry('servicios', 12000, '2026-10-02')], budgets), oct)
    const servicios = o.categories.find((c) => c.categoryId === 'servicios')!
    expect(servicios.budget).toBe(10000)
    expect(servicios.status).toBe('exceeded')
    expect(o.totalBudget).toBe(Object.values(budgets).reduce((a, b) => a + b, 0))
  })

  it('counts exceeded categories', () => {
    const o = getMonthlyOverview(input([entry('servicios', 99999, '2026-10-02')]), oct)
    expect(o.exceededCount).toBe(1)
  })
})
