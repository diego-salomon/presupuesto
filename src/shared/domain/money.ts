/**
 * Money is kept as integer whole currency units (no minor units). Integer
 * arithmetic keeps budget-status boundaries exact. Parsing and grouping are
 * driven by a locale's separators so the same code works for any currency.
 */

/** The two separators a locale uses for numbers, e.g. es-MX: group ",", decimal "."; es-UY: group ".", decimal ",". */
export interface MoneyFormat {
  readonly group: string
  readonly decimal: string
}

export function sumAmounts(amounts: readonly number[]): number {
  return amounts.reduce((total, amount) => total + amount, 0)
}

/** Percentage of `budget` covered by `spent`. A zero budget with spending is Infinity. */
export function percentOf(spent: number, budget: number): number {
  if (budget === 0) return spent === 0 ? 0 : Infinity
  return (spent / budget) * 100
}

export function isPositiveInteger(value: number): boolean {
  return Number.isInteger(value) && value > 0
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Removes whitespace and any character that is not a digit or one of the locale
 * separators. A minus sign is kept so a negative value fails parsing instead of
 * being read as positive (amounts must be greater than zero).
 */
function clean(raw: string, fmt: MoneyFormat): string {
  const keep = new RegExp(`[^0-9${escapeRe(fmt.group)}${escapeRe(fmt.decimal)}-]`, 'g')
  return raw.replace(/\s/g, '').replace(keep, '')
}

/**
 * Parses what a person types into an amount field. Accepts plain digits ("1500")
 * and values grouped in exact threes with the locale's group separator ("1,500",
 * "1.234.567"). Anything with a decimal part or bad grouping is rejected (null)
 * rather than silently misread, because amounts are whole units.
 */
export function parseAmount(raw: string, fmt: MoneyFormat): number | null {
  const cleaned = clean(raw, fmt)
  if (/^\d+$/.test(cleaned)) return Number(cleaned)
  const grouped = new RegExp(`^\\d{1,3}(${escapeRe(fmt.group)}\\d{3})+$`)
  if (grouped.test(cleaned)) return Number(cleaned.split(fmt.group).join(''))
  return null
}

/** True for numeric-looking text that parseAmount rejects (a decimal part or bad grouping). */
export function hasDecimalPart(raw: string, fmt: MoneyFormat): boolean {
  const cleaned = clean(raw, fmt)
  const numericLike = new RegExp(`^[0-9${escapeRe(fmt.group)}${escapeRe(fmt.decimal)}]*\\d[0-9${escapeRe(fmt.group)}${escapeRe(fmt.decimal)}]*$`)
  return numericLike.test(cleaned) && parseAmount(raw, fmt) === null
}

export const AMOUNT_INVALID_MESSAGE = 'Ingrese un monto mayor a cero.'
export const AMOUNT_DECIMALS_MESSAGE = 'Ingrese un monto sin decimales.'
