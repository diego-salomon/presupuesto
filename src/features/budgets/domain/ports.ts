import type { Budgets } from './category'

/**
 * The budgets backend seam. localStorage and Supabase adapters implement it.
 * `get` returns a stable snapshot (same reference until the budgets change) so
 * React's `useSyncExternalStore` can rely on it.
 */
export interface BudgetRepository {
  get(): Budgets
  set(budgets: Budgets): void
  subscribe(listener: () => void): () => void
}
