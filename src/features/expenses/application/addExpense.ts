import type { IdGenerator } from '@/shared/domain/id'
import { ok, type Result } from '@/shared/domain/result'
import type { Expense, ExpenseField, ExpenseFormInput } from '../domain/expense'
import type { ExpenseRepository } from '../domain/ports'
import { validateExpenseInput, type ExpenseValidationOptions } from '../domain/validateExpense'

export interface AddExpenseDeps {
  repo: ExpenseRepository
  newId: IdGenerator
  validation: ExpenseValidationOptions
}

export function addExpense(deps: AddExpenseDeps, input: ExpenseFormInput): Result<Expense, ExpenseField> {
  const validation = validateExpenseInput(input, deps.validation)
  if (!validation.ok) return validation
  const expense: Expense = { id: deps.newId(), ...validation.value }
  deps.repo.save(expense)
  return ok(expense)
}
