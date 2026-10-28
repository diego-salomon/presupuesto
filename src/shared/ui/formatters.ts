import type { YearMonth } from '@/shared/domain/yearMonth'
import type { CurrencyStyle } from '@/shared/infrastructure/localeFormat'

/**
 * Deterministic currency formatting: grouping is done by hand so every browser
 * renders the same text (Intl output varies subtly across engines). Amounts are
 * whole units, so there is never a decimal part.
 */
export function formatCurrency(amount: number, style: CurrencyStyle): string {
  const rounded = Math.round(Math.abs(amount))
  const grouped = String(rounded)
    .replace(/\B(?=(\d{3})+(?!\d))/g, '\u0001')
    .split('\u0001')
    .join(style.group)
  const sign = amount < 0 ? '-' : ''
  const space = style.spaced ? ' ' : ''
  return style.symbolBefore ? `${sign}${style.symbol}${space}${grouped}` : `${sign}${grouped}${space}${style.symbol}`
}

/** "5 oct 2026" — short month names come from the configured locale. */
export function formatIsoDate(iso: string, monthsShort: string[]): string {
  const [y, m, d] = iso.split('-').map(Number)
  return `${d} ${monthsShort[(m ?? 1) - 1]} ${y}`
}

export function formatPercent(value: number): string {
  return Number.isFinite(value) ? `${Math.round(value)}%` : '—'
}

/** "Octubre de 2026" — capitalized long month name from the configured locale. */
export function monthLabel(ym: YearMonth, monthsLong: string[]): string {
  const name = monthsLong[ym.month - 1] ?? ''
  const label = `${name} de ${ym.year}`
  return label.charAt(0).toUpperCase() + label.slice(1)
}
