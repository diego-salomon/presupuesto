import { sumAmounts } from '@/shared/domain/money'
import type { YearMonth } from '@/shared/domain/yearMonth'
import type { CategoryId } from '@/features/budgets/domain/category'
import { getMonthlyOverview, type MonthlyOverview, type OverviewInput } from '@/features/budgets/application/getMonthlyOverview'

export interface ComparisonRow {
  categoryId: CategoryId
  name: string
  current: number
  previous: number
  /** current - previous: positive means more spending than the previous month */
  delta: number
}

export interface MonthComparison {
  current: MonthlyOverview
  previous: MonthlyOverview
  rows: ComparisonRow[]
  totalDelta: number
}

export function compareMonths(input: OverviewInput, currentMonth: YearMonth): MonthComparison {
  const current = getMonthlyOverview(input, currentMonth)
  const previous = getMonthlyOverview(input, currentMonth.previous())
  const rows = current.categories.map((category) => {
    const before = previous.categories.find((c) => c.categoryId === category.categoryId)?.spent ?? 0
    return {
      categoryId: category.categoryId,
      name: category.name,
      current: category.spent,
      previous: before,
      delta: category.spent - before,
    }
  })
  return { current, previous, rows, totalDelta: sumAmounts(rows.map((r) => r.delta)) }
}
