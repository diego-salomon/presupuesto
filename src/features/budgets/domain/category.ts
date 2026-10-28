/**
 * Categories are white-label: the concrete list and default budgets live in
 * `src/config/presupuesto.config.ts`. The domain only knows the shape.
 */
export type CategoryId = string

export interface Category {
  readonly id: CategoryId
  readonly name: string
}

/** Monthly budget per category, in whole currency units. */
export type Budgets = Record<CategoryId, number>

export interface CategoryIndex {
  isCategoryId(value: unknown): value is CategoryId
  getCategory(id: CategoryId): Category
}

export function makeCategoryIndex(categories: readonly Category[]): CategoryIndex {
  const byId = new Map(categories.map((c) => [c.id, c]))
  return {
    isCategoryId: (value): value is CategoryId => typeof value === 'string' && byId.has(value),
    getCategory: (id) => {
      const found = byId.get(id)
      if (!found) throw new Error(`Unknown category: ${id}`)
      return found
    },
  }
}
