import type { SupabaseClient } from '@supabase/supabase-js'
import type { Budgets, Category } from '../domain/category'
import type { BudgetRepository } from '../domain/ports'

interface BudgetRow {
  category_id: string
  amount: number
}

/**
 * Live budgets backed by Supabase (one row per category, scoped to the user by
 * RLS). Reads serve an in-memory cache merged with the configured defaults, so
 * a missing row never leaves a category without a budget. Hydrated at boot.
 */
export class SupabaseBudgetRepository implements BudgetRepository {
  private value: Budgets
  private readonly listeners = new Set<() => void>()

  constructor(
    private readonly sb: SupabaseClient,
    private readonly categories: readonly Category[],
    private readonly defaultBudgets: Budgets,
    private readonly table = 'budgets',
  ) {
    this.value = { ...defaultBudgets }
  }

  get(): Budgets {
    return this.value
  }

  set(budgets: Budgets): void {
    this.value = budgets
    this.emit()
    const rows: BudgetRow[] = this.categories
      .filter((c) => typeof budgets[c.id] === 'number')
      .map((c) => ({ category_id: c.id, amount: budgets[c.id] }))
    void this.sb
      .from(this.table)
      .upsert(rows, { onConflict: 'user_id,category_id' })
      .then(({ error }) => {
        if (error) void this.hydrate()
      })
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  async hydrate(): Promise<void> {
    const { data } = await this.sb.from(this.table).select('*')
    const merged: Budgets = { ...this.defaultBudgets }
    for (const row of (data as BudgetRow[] | null) ?? []) {
      if (this.categories.some((c) => c.id === row.category_id) && Number.isInteger(row.amount) && row.amount > 0) {
        merged[row.category_id] = row.amount
      }
    }
    this.value = merged
    this.emit()
  }

  private emit(): void {
    this.listeners.forEach((l) => l())
  }
}
