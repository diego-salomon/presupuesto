import { describe, expect, it } from 'vitest'
import { hasDecimalPart, isPositiveInteger, parseAmount, percentOf, sumAmounts, type MoneyFormat } from './money'

// Dot-group locale (es-UY style) and comma-group locale (es-MX / en style).
const dot: MoneyFormat = { group: '.', decimal: ',' }
const comma: MoneyFormat = { group: ',', decimal: '.' }

describe('money', () => {
  it('sums integer amounts', () => {
    expect(sumAmounts([1000, 2500, 500])).toBe(4000)
    expect(sumAmounts([])).toBe(0)
  })

  it('computes percentage of budget, treating zero budget safely', () => {
    expect(percentOf(50, 100)).toBe(50)
    expect(percentOf(0, 100)).toBe(0)
    expect(percentOf(10, 0)).toBe(Infinity)
    expect(percentOf(0, 0)).toBe(0)
  })

  it('detects positive integers', () => {
    expect(isPositiveInteger(1)).toBe(true)
    expect(isPositiveInteger(0)).toBe(false)
    expect(isPositiveInteger(-5)).toBe(false)
    expect(isPositiveInteger(1.5)).toBe(false)
    expect(isPositiveInteger(Number.NaN)).toBe(false)
  })

  it('parses user typed amounts (dot group)', () => {
    expect(parseAmount('1500', dot)).toBe(1500)
    expect(parseAmount('1.500', dot)).toBe(1500)
    expect(parseAmount('$ 12.345', dot)).toBe(12345)
    expect(parseAmount(' 90000 ', dot)).toBe(90000)
    expect(parseAmount('', dot)).toBeNull()
    expect(parseAmount('abc', dot)).toBeNull()
    expect(parseAmount('12,5', dot)).toBeNull()
  })

  it.each([
    ['120.000', 120000],
    ['1.234.567', 1234567],
    ['$ 1.500', 1500],
  ])('accepts valid thousand grouping %j', (raw, expected) => {
    expect(parseAmount(raw, dot)).toBe(expected)
  })

  it.each(['1500.50', '1500,50', '1.5', '1,5', '1.50', '1.500,50', '1500.500', '12.34.567', '.500', '1.5000', '1500,00'])(
    'rejects decimals or invalid grouping %j (dot group)',
    (raw) => {
      expect(parseAmount(raw, dot)).toBeNull()
    },
  )

  it('works for a comma-group locale too', () => {
    expect(parseAmount('1,500', comma)).toBe(1500)
    expect(parseAmount('12,345', comma)).toBe(12345)
    expect(parseAmount('1.5', comma)).toBeNull()
    expect(parseAmount('1,5', comma)).toBeNull()
  })

  it('flags numeric text that cannot be a whole amount as having a decimal part', () => {
    expect(hasDecimalPart('1500.50', dot)).toBe(true)
    expect(hasDecimalPart('1,5', dot)).toBe(true)
    expect(hasDecimalPart('1.500', dot)).toBe(false)
    expect(hasDecimalPart('abc', dot)).toBe(false)
    expect(hasDecimalPart('', dot)).toBe(false)
  })
})
