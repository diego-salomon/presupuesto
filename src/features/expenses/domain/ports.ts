import type { Expense } from './expense'

/**
 * The expenses backend seam. localStorage and Supabase adapters implement it.
 * `list` returns a stable snapshot (same reference until the data changes) so
 * React's `useSyncExternalStore` can rely on it.
 */
export interface ExpenseRepository {
  list(): readonly Expense[]
  /** Insert a new expense, or replace the existing one with the same id. */
  save(expense: Expense): void
  /** Remove by id; returns whether an expense was removed. */
  remove(id: string): boolean
  /** Replace all data with freshly generated example data (demo only). */
  resetToSeed(): void
  subscribe(listener: () => void): () => void
}
