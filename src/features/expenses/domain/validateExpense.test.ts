import { describe, expect, it } from 'vitest'
import { makeCategoryIndex } from '@/features/budgets/domain/category'
import { presupuesto } from '@/config/presupuesto.config'
import { validateExpenseInput, type ExpenseValidationOptions } from './validateExpense'

const options: ExpenseValidationOptions = {
  isCategoryId: makeCategoryIndex(presupuesto.categories).isCategoryId,
  money: { group: '.', decimal: ',' },
}

const valid = {
  categoryId: 'servicios',
  amount: '12.500',
  date: '2026-10-05',
  description: '  Factura de electricidad  ',
}

describe('validateExpenseInput', () => {
  it('accepts a complete input and normalizes it', () => {
    expect(validateExpenseInput(valid, options)).toEqual({
      ok: true,
      value: { categoryId: 'servicios', amount: 12500, date: '2026-10-05', description: 'Factura de electricidad' },
    })
  })

  it('allows an empty description', () => {
    const r = validateExpenseInput({ ...valid, description: '' }, options)
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.value.description).toBe('')
  })

  it('requires a category', () => {
    const r = validateExpenseInput({ ...valid, categoryId: '' }, options)
    expect(r).toMatchObject({ ok: false, errors: { categoryId: 'Seleccione una categoría.' } })
  })

  it('rejects an unknown category', () => {
    expect(validateExpenseInput({ ...valid, categoryId: 'otra' }, options).ok).toBe(false)
  })

  it.each(['', '   ', '0', '-5', 'abc'])('rejects amount %j', (amount) => {
    const r = validateExpenseInput({ ...valid, amount }, options)
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.errors.amount).toBe('Ingrese un monto mayor a cero.')
  })

  it.each(['1500.50', '1500,50', '1.5', '1,5'])('rejects decimal amount %j with a specific message', (amount) => {
    const r = validateExpenseInput({ ...valid, amount }, options)
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.errors.amount).toBe('Ingrese un monto sin decimales.')
  })

  it.each(['', '2026-13-01', '2026-02-30', 'hoy', '05/10/2026'])('rejects date %j', (date) => {
    const r = validateExpenseInput({ ...valid, date }, options)
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.errors.date).toBe('Ingrese una fecha válida.')
  })

  it('reports every missing required field at once', () => {
    const r = validateExpenseInput({ categoryId: '', amount: '', date: '', description: '' }, options)
    expect(r.ok).toBe(false)
    if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(['amount', 'categoryId', 'date'])
  })

  it('limits the description length', () => {
    const r = validateExpenseInput({ ...valid, description: 'x'.repeat(141) }, options)
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.errors.description).toMatch(/140/)
  })
})
