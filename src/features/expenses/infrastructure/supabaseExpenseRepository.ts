import type { SupabaseClient } from '@supabase/supabase-js'
import type { Expense } from '../domain/expense'
import type { ExpenseRepository } from '../domain/ports'

interface ExpenseRow {
  id: string
  category_id: string
  amount: number
  date: string
  description: string | null
}

const toExpense = (r: ExpenseRow): Expense => ({
  id: r.id,
  categoryId: r.category_id,
  amount: r.amount,
  date: r.date,
  description: r.description ?? '',
})

const toRow = (e: Expense): ExpenseRow => ({
  id: e.id,
  category_id: e.categoryId,
  amount: e.amount,
  date: e.date,
  description: e.description,
})

/**
 * Live expenses backed by Supabase. Reads are served synchronously from an
 * in-memory cache hydrated at boot (see hydrate()); writes update the cache
 * optimistically and persist in the background, re-hydrating if the write fails.
 * RLS scopes every row to the signed-in user (see supabase/schema.sql).
 */
export class SupabaseExpenseRepository implements ExpenseRepository {
  private items: readonly Expense[] = []
  private readonly listeners = new Set<() => void>()

  constructor(
    private readonly sb: SupabaseClient,
    private readonly table = 'expenses',
  ) {}

  list(): readonly Expense[] {
    return this.items
  }

  save(expense: Expense): void {
    const exists = this.items.some((x) => x.id === expense.id)
    this.items = exists ? this.items.map((x) => (x.id === expense.id ? expense : x)) : [...this.items, expense]
    this.emit()
    void this.sb
      .from(this.table)
      .upsert(toRow(expense))
      .then(({ error }) => {
        if (error) void this.hydrate()
      })
  }

  remove(id: string): boolean {
    const before = this.items
    this.items = this.items.filter((x) => x.id !== id)
    if (this.items.length === before.length) return false
    this.emit()
    void this.sb
      .from(this.table)
      .delete()
      .eq('id', id)
      .then(({ error }) => {
        if (error) void this.hydrate()
      })
    return true
  }

  /** Example data is a demo-only concept; in live mode this is a no-op. */
  resetToSeed(): void {
    /* no example data in live mode */
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  /** Loads all rows into the cache. Awaited once at boot before the first render. */
  async hydrate(): Promise<void> {
    const { data } = await this.sb.from(this.table).select('*').order('date', { ascending: false })
    this.items = ((data as ExpenseRow[] | null) ?? []).map(toExpense)
    this.emit()
  }

  private emit(): void {
    this.listeners.forEach((l) => l())
  }
}
