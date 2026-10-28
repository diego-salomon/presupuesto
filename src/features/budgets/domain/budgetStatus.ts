export type BudgetStatus = 'ok' | 'warning' | 'exceeded'

export const DEFAULT_WARNING_PERCENT = 80

/**
 * ok: spent is below `warningPercent` of budget.
 * warning: between `warningPercent` and 100% (inclusive).
 * exceeded: spent is over budget.
 * Integer arithmetic only (`spent * 100` vs `budget * warningPercent`), so the
 * boundaries are exact regardless of the numbers.
 */
export function budgetStatus(spent: number, budget: number, warningPercent = DEFAULT_WARNING_PERCENT): BudgetStatus {
  if (spent > budget) return 'exceeded'
  if (budget > 0 && spent * 100 >= budget * warningPercent) return 'warning'
  return 'ok'
}
