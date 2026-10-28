import { useMemo } from 'react'
import type { YearMonth } from '@/shared/domain/yearMonth'
import { useBudgets, useContainer, useExpenses } from '@/app/AppContext'
import { getMonthlyOverview, type MonthlyOverview } from '../application/getMonthlyOverview'

export function useMonthlyOverview(month: YearMonth): MonthlyOverview {
  const { categories, warningPercent } = useContainer()
  const expenses = useExpenses()
  const budgets = useBudgets()
  return useMemo(
    () => getMonthlyOverview({ budgets, expenses, categories, warningPercent }, month),
    [budgets, expenses, categories, warningPercent, month],
  )
}
