import type { Budgets } from '@/features/budgets/domain/category'
import type { BudgetRepository } from '@/features/budgets/domain/ports'
import type { ExpenseRepository } from '@/features/expenses/domain/ports'

export interface ResetDemoDeps {
  expenses: ExpenseRepository
  budgets: BudgetRepository
  defaultBudgets: Budgets
}

/** Restores default budgets and regenerates the example expenses (demo only). */
export function resetDemoData(deps: ResetDemoDeps): void {
  deps.budgets.set({ ...deps.defaultBudgets })
  deps.expenses.resetToSeed()
}
