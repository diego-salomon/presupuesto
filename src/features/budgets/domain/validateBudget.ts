import { isPositiveInteger } from '@/shared/domain/money'
import { fail, ok, type Result } from '@/shared/domain/result'

export const BUDGET_INVALID_MESSAGE = 'Ingrese un número entero positivo.'

export function validateBudgetAmount(amount: number): Result<number, 'amount'> {
  if (!isPositiveInteger(amount)) return fail({ amount: BUDGET_INVALID_MESSAGE })
  return ok(amount)
}
