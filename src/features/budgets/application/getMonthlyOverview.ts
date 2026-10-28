import { sumAmounts } from '@/shared/domain/money'
import type { YearMonth } from '@/shared/domain/yearMonth'
import type { Budgets, Category } from '../domain/category'
import { summarizeCategory, type CategorySummary } from '../domain/categorySummary'
import type { SpendEntry } from '../domain/spendEntry'

export interface OverviewInput {
  budgets: Budgets
  expenses: readonly SpendEntry[]
  categories: readonly Category[]
  warningPercent?: number
}

export interface MonthlyOverview {
  month: YearMonth
  /** total spending across all categories in the month */
  total: number
  totalBudget: number
  exceededCount: number
  categories: CategorySummary[]
}

/** Monthly totals are always derived from expense dates: nothing is ever "reset" or deleted. */
export function getMonthlyOverview(input: OverviewInput, month: YearMonth): MonthlyOverview {
  const inMonth = input.expenses.filter((e) => month.contains(e.date))
  const categories = input.categories.map((category) =>
    summarizeCategory(
      category,
      input.budgets[category.id] ?? 0,
      sumAmounts(inMonth.filter((e) => e.categoryId === category.id).map((e) => e.amount)),
      input.warningPercent,
    ),
  )
  return {
    month,
    total: sumAmounts(categories.map((c) => c.spent)),
    totalBudget: sumAmounts(categories.map((c) => c.budget)),
    exceededCount: categories.filter((c) => c.status === 'exceeded').length,
    categories,
  }
}
