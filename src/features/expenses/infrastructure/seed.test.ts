import { describe, expect, it } from 'vitest'
import { FixedClock } from '@/shared/infrastructure/fixedClock'
import { YearMonth } from '@/shared/domain/yearMonth'
import { presupuesto } from '@/config/presupuesto.config'
import { getMonthlyOverview } from '@/features/budgets/application/getMonthlyOverview'
import { generateSeedExpenses } from './seed'

const { categories, defaultBudgets, warningPercent, demoSeed } = presupuesto
const ids = () => {
  let n = 0
  return () => `seed-${++n}`
}
const overviewFor = (seed: ReturnType<typeof generateSeedExpenses>, month: YearMonth) =>
  getMonthlyOverview({ budgets: defaultBudgets, expenses: seed, categories, warningPercent }, month)

describe.each(['2026-10-01', '2026-10-03', '2026-10-20', '2026-10-31', '2026-02-02', '2026-03-31'])(
  'seed relative to %s',
  (today) => {
    const clock = new FixedClock(today)
    const now = YearMonth.fromDate(clock.now())
    const seed = generateSeedExpenses(demoSeed, clock, ids())

    it('has 15-20 current-month expenses, none after today', () => {
      const current = seed.filter((x) => now.contains(x.date))
      expect(current.length).toBeGreaterThanOrEqual(15)
      expect(current.length).toBeLessThanOrEqual(20)
      const day = clock.now().getDate()
      expect(current.every((x) => Number(x.date.slice(8, 10)) <= day)).toBe(true)
    })

    it('has one category over budget, one in warning and at least one ok', () => {
      const overview = overviewFor(seed, now)
      expect(overview.categories.some((c) => c.status === 'exceeded' && c.percent > 100)).toBe(true)
      expect(overview.categories.some((c) => c.percent >= 80 && c.percent <= 100)).toBe(true)
      expect(overview.categories.some((c) => c.status === 'ok')).toBe(true)
    })

    it('has 10-14 previous-month expenses, all within budget', () => {
      const previous = seed.filter((x) => now.previous().contains(x.date))
      expect(previous.length).toBeGreaterThanOrEqual(10)
      expect(previous.length).toBeLessThanOrEqual(14)
      expect(overviewFor(seed, now.previous()).categories.every((c) => c.status !== 'exceeded')).toBe(true)
    })

    it('has unique ids, non-empty descriptions and valid ISO dates', () => {
      expect(new Set(seed.map((x) => x.id)).size).toBe(seed.length)
      expect(seed.every((x) => x.description.length > 0)).toBe(true)
      expect(seed.every((x) => /^\d{4}-\d{2}-\d{2}$/.test(x.date))).toBe(true)
    })
  },
)

describe('story', () => {
  it('spends more this month than last on the campaign categories', () => {
    const clock = new FixedClock('2026-10-20')
    const seed = generateSeedExpenses(demoSeed, clock, ids())
    const now = YearMonth.of(2026, 10)
    const cur = overviewFor(seed, now)
    const prev = overviewFor(seed, now.previous())
    for (const id of ['insumos', 'marketing']) {
      const c = cur.categories.find((x) => x.categoryId === id)!
      const p = prev.categories.find((x) => x.categoryId === id)!
      expect(c.spent).toBeGreaterThan(p.spent)
    }
  })
})
