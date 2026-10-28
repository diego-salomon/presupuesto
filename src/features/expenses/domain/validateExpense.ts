import {
  AMOUNT_DECIMALS_MESSAGE,
  AMOUNT_INVALID_MESSAGE,
  hasDecimalPart,
  isPositiveInteger,
  parseAmount,
  type MoneyFormat,
} from '@/shared/domain/money'
import { fail, ok, type Result } from '@/shared/domain/result'
import type { CategoryId } from '@/features/budgets/domain/category'
import type { ExpenseDraft, ExpenseField, ExpenseFormInput } from './expense'

export const MAX_DESCRIPTION_LENGTH = 140

export const CATEGORY_REQUIRED_MESSAGE = 'Seleccione una categoría.'
export const DATE_INVALID_MESSAGE = 'Ingrese una fecha válida.'

/** Everything the validator needs from configuration, injected rather than imported. */
export interface ExpenseValidationOptions {
  isCategoryId: (value: unknown) => value is CategoryId
  money: MoneyFormat
  maxDescription?: number
}

function isRealIsoDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return false
  const [y, m, d] = [Number(match[1]), Number(match[2]), Number(match[3])]
  const date = new Date(y, m - 1, d)
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d
}

export function validateExpenseInput(
  input: ExpenseFormInput,
  options: ExpenseValidationOptions,
): Result<ExpenseDraft, ExpenseField> {
  const max = options.maxDescription ?? MAX_DESCRIPTION_LENGTH
  const errors: Partial<Record<ExpenseField, string>> = {}
  const amount = parseAmount(input.amount, options.money)
  const description = input.description.trim()
  const categoryOk = options.isCategoryId(input.categoryId)

  if (!categoryOk) errors.categoryId = CATEGORY_REQUIRED_MESSAGE
  if (amount === null && hasDecimalPart(input.amount, options.money)) errors.amount = AMOUNT_DECIMALS_MESSAGE
  else if (amount === null || !isPositiveInteger(amount)) errors.amount = AMOUNT_INVALID_MESSAGE
  if (!isRealIsoDate(input.date)) errors.date = DATE_INVALID_MESSAGE
  if (description.length > max) errors.description = `La descripción admite hasta ${max} caracteres.`

  if (Object.keys(errors).length > 0 || amount === null || !categoryOk) return fail(errors)
  return ok({ categoryId: input.categoryId, amount, date: input.date, description })
}
