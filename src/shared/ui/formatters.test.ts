import { describe, expect, it } from 'vitest'
import { YearMonth } from '@/shared/domain/yearMonth'
import type { CurrencyStyle } from '@/shared/infrastructure/localeFormat'
import { formatCurrency, formatIsoDate, formatPercent, monthLabel } from './formatters'

const symbolBefore: CurrencyStyle = { symbol: '$', symbolBefore: true, spaced: false, group: ',', decimal: '.' }
const spacedStyle: CurrencyStyle = { symbol: '$', symbolBefore: true, spaced: true, group: '.', decimal: ',' }
const symbolAfter: CurrencyStyle = { symbol: '€', symbolBefore: false, spaced: true, group: '.', decimal: ',' }

const monthsShort = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
const monthsLong = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
]

describe('formatCurrency', () => {
  it('groups thousands deterministically with the symbol before', () => {
    expect(formatCurrency(120000, symbolBefore)).toBe('$120,000')
    expect(formatCurrency(0, symbolBefore)).toBe('$0')
    expect(formatCurrency(999, symbolBefore)).toBe('$999')
    expect(formatCurrency(1500, symbolBefore)).toBe('$1,500')
    expect(formatCurrency(1234567, symbolBefore)).toBe('$1,234,567')
    expect(formatCurrency(-2500, symbolBefore)).toBe('-$2,500')
  })

  it('honours a spaced symbol and a dot group', () => {
    expect(formatCurrency(120000, spacedStyle)).toBe('$ 120.000')
    expect(formatCurrency(-2500, spacedStyle)).toBe('-$ 2.500')
  })

  it('places the symbol after when configured', () => {
    expect(formatCurrency(1500, symbolAfter)).toBe('1.500 €')
  })
})

describe('formatIsoDate / formatPercent / monthLabel', () => {
  it('formats ISO dates in short form', () => {
    expect(formatIsoDate('2026-10-05', monthsShort)).toBe('5 oct 2026')
    expect(formatIsoDate('2026-01-31', monthsShort)).toBe('31 ene 2026')
  })

  it('formats percentages rounded', () => {
    expect(formatPercent(79.99)).toBe('80%')
    expect(formatPercent(112.5)).toBe('113%')
    expect(formatPercent(Infinity)).toBe('—')
  })

  it('capitalizes the month label', () => {
    expect(monthLabel(YearMonth.of(2026, 10), monthsLong)).toBe('Octubre de 2026')
  })
})
