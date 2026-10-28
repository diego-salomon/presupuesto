import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryStorage } from '@/shared/infrastructure/memoryStorage'
import { makeCategoryIndex } from '@/features/budgets/domain/category'
import { presupuesto } from '@/config/presupuesto.config'
import { LocalExpenseRepository } from '../infrastructure/localExpenseRepository'
import type { ExpenseValidationOptions } from '../domain/validateExpense'
import { addExpense } from './addExpense'
import { editExpense } from './editExpense'
import { deleteExpense } from './deleteExpense'

const index = makeCategoryIndex(presupuesto.categories)
const validation: ExpenseValidationOptions = { isCategoryId: index.isCategoryId, money: { group: '.', decimal: ',' } }

let repo: LocalExpenseRepository
let counter = 0
const newId = () => `id-${++counter}`
const input = { categoryId: 'personal', amount: '62000', date: '2026-10-03', description: 'Sueldo del equipo' }

beforeEach(() => {
  counter = 0
  repo = new LocalExpenseRepository({
    storage: new MemoryStorage(),
    key: 'expenses',
    isCategoryId: index.isCategoryId,
    makeSeed: () => [],
  })
})

describe('addExpense', () => {
  it('stores a valid expense with a generated id', () => {
    const r = addExpense({ repo, newId, validation }, input)
    expect(r.ok).toBe(true)
    expect(repo.list()).toEqual([
      { id: 'id-1', categoryId: 'personal', amount: 62000, date: '2026-10-03', description: 'Sueldo del equipo' },
    ])
  })

  it('does not store anything when invalid', () => {
    const r = addExpense({ repo, newId, validation }, { ...input, amount: '' })
    expect(r.ok).toBe(false)
    expect(repo.list()).toHaveLength(0)
  })
})

describe('editExpense', () => {
  it('updates fields keeping the id, moving the amount between categories', () => {
    addExpense({ repo, newId, validation }, input)
    const r = editExpense({ repo, validation }, 'id-1', { ...input, categoryId: 'servicios', amount: '1.000' })
    expect(r.ok).toBe(true)
    expect(repo.list()[0]).toMatchObject({ id: 'id-1', categoryId: 'servicios', amount: 1000 })
  })

  it('rejects invalid edits leaving data untouched', () => {
    addExpense({ repo, newId, validation }, input)
    const r = editExpense({ repo, validation }, 'id-1', { ...input, date: '' })
    expect(r.ok).toBe(false)
    expect(repo.list()[0]?.date).toBe('2026-10-03')
  })

  it('fails for an unknown id', () => {
    expect(editExpense({ repo, validation }, 'nope', input).ok).toBe(false)
  })
})

describe('deleteExpense', () => {
  it('removes only the requested expense and reports success', () => {
    addExpense({ repo, newId, validation }, input)
    addExpense({ repo, newId, validation }, { ...input, amount: '5' })
    expect(deleteExpense(repo, 'id-1')).toBe(true)
    expect(repo.list().map((x) => x.id)).toEqual(['id-2'])
    expect(deleteExpense(repo, 'id-1')).toBe(false)
  })
})
