import type { KeyValueStorage } from '@/shared/domain/storage'
import type { CategoryId } from '@/features/budgets/domain/category'
import type { Expense } from '../domain/expense'
import type { ExpenseRepository } from '../domain/ports'

export interface LocalExpenseDeps {
  storage: KeyValueStorage
  key: string
  isCategoryId: (value: unknown) => value is CategoryId
  /** Produces fresh example data for resetToSeed(). */
  makeSeed: () => readonly Expense[]
}

/**
 * Expenses persisted as one JSON array under a versioned key. Corrupt or
 * malformed records are ignored on read (never crash). `list()` returns a stable
 * snapshot until the data changes, which `useSyncExternalStore` relies on.
 */
export class LocalExpenseRepository implements ExpenseRepository {
  private readonly listeners = new Set<() => void>()
  private cache: { raw: string | null; items: readonly Expense[] } = { raw: null, items: [] }

  constructor(private readonly deps: LocalExpenseDeps) {}

  list(): readonly Expense[] {
    const raw = this.deps.storage.getItem(this.deps.key)
    if (raw === this.cache.raw) return this.cache.items
    this.cache = { raw, items: this.parse(raw) }
    return this.cache.items
  }

  save(expense: Expense): void {
    const current = this.list()
    const exists = current.some((x) => x.id === expense.id)
    this.write(exists ? current.map((x) => (x.id === expense.id ? expense : x)) : [...current, expense])
  }

  remove(id: string): boolean {
    const current = this.list()
    const next = current.filter((x) => x.id !== id)
    if (next.length === current.length) return false
    this.write(next)
    return true
  }

  resetToSeed(): void {
    this.write([...this.deps.makeSeed()])
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private write(items: readonly Expense[]): void {
    const raw = JSON.stringify(items)
    this.deps.storage.setItem(this.deps.key, raw)
    this.cache = { raw, items }
    this.listeners.forEach((l) => l())
  }

  private parse(raw: string | null): readonly Expense[] {
    if (raw === null) return []
    try {
      const parsed: unknown = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed.filter((x) => this.isExpense(x)) : []
    } catch {
      return []
    }
  }

  private isExpense(v: unknown): v is Expense {
    if (typeof v !== 'object' || v === null) return false
    const x = v as Record<string, unknown>
    return (
      typeof x.id === 'string' &&
      this.deps.isCategoryId(x.categoryId) &&
      typeof x.amount === 'number' &&
      Number.isInteger(x.amount) &&
      x.amount > 0 &&
      typeof x.date === 'string' &&
      /^\d{4}-\d{2}-\d{2}$/.test(x.date) &&
      typeof x.description === 'string'
    )
  }
}
