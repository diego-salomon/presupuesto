import { useMemo } from 'react'
import { useBudgets, useContainer, useCurrentMonth, useExpenses } from '@/app/AppContext'
import { useFormat } from '@/shared/ui/useFormat'
import { CategoryGrid } from '@/features/budgets/ui/CategoryGrid'
import { MonthlyTotalCard } from '@/features/budgets/ui/MonthlyTotalCard'
import { compareMonths } from '../application/compareMonths'
import { ComparisonSection } from './ComparisonSection'

export function PreviousMonthPage() {
  const { categories, warningPercent } = useContainer()
  const month = useCurrentMonth()
  const expenses = useExpenses()
  const budgets = useBudgets()
  const f = useFormat()

  const comparison = useMemo(
    () => compareMonths({ budgets, expenses, categories, warningPercent }, month),
    [budgets, expenses, categories, warningPercent, month],
  )
  const previousName = f.month(month.previous())

  return (
    <section className="flex flex-col gap-5">
      <header>
        <h2 className="text-2xl font-bold tracking-tight">Mes anterior</h2>
        <p className="text-sm text-muted-foreground">{previousName} · solo lectura.</p>
      </header>

      <MonthlyTotalCard overview={comparison.previous} monthName={previousName} />
      <CategoryGrid categories={comparison.previous.categories} />
      <ComparisonSection comparison={comparison} />
    </section>
  )
}
