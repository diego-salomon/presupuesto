import type { CategorySummary } from '../domain/categorySummary'
import { CategoryCard } from './CategoryCard'

export function CategoryGrid({ categories }: { categories: CategorySummary[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((summary) => (
        <CategoryCard key={summary.categoryId} summary={summary} />
      ))}
    </div>
  )
}
