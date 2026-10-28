import type { KeyValueStorage } from '@/shared/domain/storage'
import type { Budgets, Category } from '../domain/category'
import type { BudgetRepository } from '../domain/ports'

export interface LocalBudgetDeps {
  storage: KeyValueStorage
  key: string
  categories: readonly Category[]
  defaultBudgets: Budgets
}

/**
 * Budgets persisted under a versioned key. Each category falls back to its
 * default when missing or invalid, so a client can add categories without
 * wiping stored ones. `get()` returns a stable snapshot until the data changes.
 */
export class LocalBudgetRepository implements BudgetRepository {
  private readonly listeners = new Set<() => void>()
  private cache: { raw: string | null; value: Budgets } | null = null

  constructor(private readonly deps: LocalBudgetDeps) {}

  get(): Budgets {
    const raw = this.deps.storage.getItem(this.deps.key)
    if (this.cache && this.cache.raw === raw) return this.cache.value
    this.cache = { raw, value: this.parse(raw) }
    return this.cache.value
  }

  set(budgets: Budgets): void {
    const raw = JSON.stringify(budgets)
    this.deps.storage.setItem(this.deps.key, raw)
    this.cache = { raw, value: this.parse(raw) }
    this.listeners.forEach((l) => l())
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private parse(raw: string | null): Budgets {
    const budgets: Budgets = { ...this.deps.defaultBudgets }
    if (raw === null) return budgets
    try {
      const parsed = JSON.parse(raw) as unknown
      if (typeof parsed !== 'object' || parsed === null) return budgets
      for (const { id } of this.deps.categories) {
        const n = (parsed as Record<string, unknown>)[id]
        if (typeof n === 'number' && Number.isInteger(n) && n > 0) budgets[id] = n
      }
    } catch {
      /* corrupt JSON: defaults */
    }
    return budgets
  }
}
