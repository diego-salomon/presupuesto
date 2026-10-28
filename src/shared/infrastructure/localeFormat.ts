import type { MoneyFormat } from '@/shared/domain/money'

/** Everything the UI needs to render money and dates for a given locale + currency. */
export interface CurrencyStyle {
  symbol: string
  symbolBefore: boolean
  spaced: boolean
  group: string
  decimal: string
}

export interface LocaleFormats {
  money: MoneyFormat
  currency: CurrencyStyle
  monthsShort: string[]
  monthsLong: string[]
}

function months(locale: string, month: 'short' | 'long'): string[] {
  const fmt = new Intl.DateTimeFormat(locale, { month, timeZone: 'UTC' })
  return Array.from({ length: 12 }, (_, i) => fmt.format(new Date(Date.UTC(2021, i, 1))))
}

/** Derives separators, currency symbol and month names from the browser's Intl data. */
export function buildLocaleFormats(locale: string, currency: string): LocaleFormats {
  const currencyParts = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).formatToParts(1111)

  const group = currencyParts.find((p) => p.type === 'group')?.value ?? ','
  const symbol = currencyParts.find((p) => p.type === 'currency')?.value ?? '$'
  const currencyIndex = currencyParts.findIndex((p) => p.type === 'currency')
  const integerIndex = currencyParts.findIndex((p) => p.type === 'integer')
  const symbolBefore = currencyIndex !== -1 && currencyIndex < integerIndex
  const spaced = currencyParts.some((p) => p.type === 'literal' && /\s/.test(p.value))

  const decimal =
    new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
      .formatToParts(1.1)
      .find((p) => p.type === 'decimal')?.value ?? '.'

  return {
    money: { group, decimal },
    currency: { symbol, symbolBefore, spaced, group, decimal },
    monthsShort: months(locale, 'short'),
    monthsLong: months(locale, 'long'),
  }
}
