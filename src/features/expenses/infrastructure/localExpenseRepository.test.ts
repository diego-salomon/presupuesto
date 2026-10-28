import { describe, expect, it } from 'vitest'
import { MemoryStorage } from '@/shared/infrastructure/memoryStorage'
import { makeCategoryIndex } from '@/features/budgets/domain/category'
import { presupuesto } from '@/config/presupuesto.config'
import type { Expense } from '../domain/expense'
import { LocalExpenseRepository } from './localExpenseRepository'

const KEY = 'presupuesto.v1.expenses'
const isCategoryId = makeCategoryIndex(presupuesto.categories).isCategoryId
const sample: Expense = { id: 'a', categoryId: 'servicios', amount: 100, date: '2026-10-01', description: 'Internet' }

const makeRepo = (storage = new MemoryStorage(), makeSeed: () => readonly Expense[] = () => []) =>
  new LocalExpenseRepository({ storage, key: KEY, isCategoryId, makeSeed })

describe('LocalExpenseRepository', () => {
  it('persists across instances sharing the same storage', () => {
    const storage = new MemoryStorage()
    makeRepo(storage).save(sample)
    expect(makeRepo(storage).list()).toEqual([sample])
  })

  it('starts empty and treats corrupt JSON as empty', () => {
    const storage = new MemoryStorage()
    expect(makeRepo(storage).list()).toEqual([])
    storage.setItem(KEY, '{broken')
    expect(makeRepo(storage).list()).toEqual([])
  })

  it('ignores malformed records when reading but keeps valid ones', () => {
    const storage = new MemoryStorage()
    storage.setItem(KEY, JSON.stringify([sample, { id: 'x', amount: 'mucho' }, null]))
    expect(makeRepo(storage).list()).toEqual([sample])
  })

  it('saves (insert then replace by id) and removes, reporting whether it removed', () => {
    const repo = makeRepo()
    repo.save(sample)
    repo.save({ ...sample, amount: 5 })
    expect(repo.list()).toEqual([{ ...sample, amount: 5 }])
    expect(repo.remove('missing')).toBe(false)
    expect(repo.remove('a')).toBe(true)
    expect(repo.list()).toEqual([])
  })

  it('notifies subscribers on every change', () => {
    const repo = makeRepo()
    let calls = 0
    const off = repo.subscribe(() => calls++)
    repo.save(sample)
    repo.save({ ...sample, amount: 5 })
    repo.remove('a')
    off()
    repo.save(sample)
    expect(calls).toBe(3)
  })

  it('returns a stable snapshot until data changes', () => {
    const repo = makeRepo()
    repo.save(sample)
    expect(repo.list()).toBe(repo.list())
    const before = repo.list()
    repo.save({ ...sample, id: 'b' })
    expect(repo.list()).not.toBe(before)
  })

  it('resetToSeed replaces everything with fresh example data', () => {
    const seed: Expense[] = [{ ...sample, id: 'seed-1' }]
    const repo = makeRepo(new MemoryStorage(), () => seed)
    repo.save(sample)
    repo.resetToSeed()
    expect(repo.list().map((x) => x.id)).toEqual(['seed-1'])
  })
})
