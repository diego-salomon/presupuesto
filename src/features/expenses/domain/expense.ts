import type { CategoryId } from '@/features/budgets/domain/category'

export interface Expense {
  readonly id: string
  readonly categoryId: CategoryId
  /** integer whole currency units, > 0 */
  readonly amount: number
  /** ISO date, YYYY-MM-DD */
  readonly date: string
  readonly description: string
}

/** What the form hands over: everything as raw strings. */
export interface ExpenseFormInput {
  categoryId: string
  amount: string
  date: string
  description: string
}

/** A validated expense without identity yet. */
export type ExpenseDraft = Omit<Expense, 'id'>

export type ExpenseField = 'categoryId' | 'amount' | 'date' | 'description'
