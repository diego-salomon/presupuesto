import { fail, ok, type Result } from '@/shared/domain/result'
import type { Expense, ExpenseField, ExpenseFormInput } from '../domain/expense'
import type { ExpenseRepository } from '../domain/ports'
import { validateExpenseInput, type ExpenseValidationOptions } from '../domain/validateExpense'

export interface EditExpenseDeps {
  repo: ExpenseRepository
  validation: ExpenseValidationOptions
}

export const EXPENSE_NOT_FOUND_MESSAGE = 'No se encontró el gasto a editar.'

export function editExpense(
  deps: EditExpenseDeps,
  id: string,
  input: ExpenseFormInput,
): Result<Expense, ExpenseField | 'general'> {
  const validation = validateExpenseInput(input, deps.validation)
  if (!validation.ok) return validation
  if (!deps.repo.list().some((x) => x.id === id)) return fail({ general: EXPENSE_NOT_FOUND_MESSAGE })
  const expense: Expense = { id, ...validation.value }
  deps.repo.save(expense)
  return ok(expense)
}
