import type { CategoryId } from './category'

/** The minimum the budget calculations need to know about an expense. */
export interface SpendEntry {
  readonly categoryId: CategoryId
  readonly amount: number
  /** ISO date, YYYY-MM-DD */
  readonly date: string
}
