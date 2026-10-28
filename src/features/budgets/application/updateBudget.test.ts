import { describe, expect, it } from 'vitest'
import { MemoryStorage } from '@/shared/infrastructure/memoryStorage'
import { presupuesto } from '@/config/presupuesto.config'
import { LocalBudgetRepository } from '../infrastructure/localBudgetRepository'
import { updateBudget } from './updateBudget'

const { categories, defaultBudgets } = presupuesto
const makeRepo = () =>
  new LocalBudgetRepository({ storage: new MemoryStorage(), key: 'budgets', categories, defaultBudgets })

describe('updateBudget', () => {
  it('persists a valid budget', () => {
    const repo = makeRepo()
    const r = updateBudget(repo, 'servicios', 42000)
    expect(r.ok).toBe(true)
    expect(repo.get().servicios).toBe(42000)
  })

  it.each([0, -1, 1.5, Number.NaN])('rejects %s and leaves the budget unchanged', (value) => {
    const repo = makeRepo()
    const r = updateBudget(repo, 'servicios', value)
    expect(r.ok).toBe(false)
    expect(repo.get().servicios).toBe(defaultBudgets.servicios)
    if (!r.ok) expect(r.errors.amount).toMatch(/entero positivo/)
  })
})
