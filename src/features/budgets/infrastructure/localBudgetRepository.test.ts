import { describe, expect, it } from 'vitest'
import { MemoryStorage } from '@/shared/infrastructure/memoryStorage'
import { presupuesto } from '@/config/presupuesto.config'
import { LocalBudgetRepository } from './localBudgetRepository'

const KEY = 'presupuesto.v1.budgets'
const { categories, defaultBudgets } = presupuesto
const makeRepo = (storage = new MemoryStorage()) => new LocalBudgetRepository({ storage, key: KEY, categories, defaultBudgets })

describe('LocalBudgetRepository', () => {
  it('starts with default budgets and survives a new instance', () => {
    const storage = new MemoryStorage()
    expect(makeRepo(storage).get()).toEqual(defaultBudgets)
    makeRepo(storage).set({ ...defaultBudgets, personal: 160000 })
    expect(makeRepo(storage).get().personal).toBe(160000)
  })

  it('falls back to defaults on corrupt or invalid data', () => {
    const storage = new MemoryStorage()
    storage.setItem(KEY, '{oops')
    expect(makeRepo(storage).get()).toEqual(defaultBudgets)
    storage.setItem(KEY, JSON.stringify({ personal: -3, servicios: 'x' }))
    expect(makeRepo(storage).get()).toEqual(defaultBudgets)
  })

  it('keeps valid categories and defaults only the corrupt ones', () => {
    const storage = new MemoryStorage()
    storage.setItem(KEY, JSON.stringify({ personal: 160000, servicios: 'x', insumos: -3 }))
    expect(makeRepo(storage).get()).toEqual({ ...defaultBudgets, personal: 160000 })
  })

  it('notifies subscribers on change and returns a stable snapshot', () => {
    const repo = makeRepo()
    let calls = 0
    const off = repo.subscribe(() => calls++)
    expect(repo.get()).toBe(repo.get())
    repo.set({ ...defaultBudgets, personal: 1000 })
    off()
    repo.set({ ...defaultBudgets, personal: 2000 })
    expect(calls).toBe(1)
  })
})
