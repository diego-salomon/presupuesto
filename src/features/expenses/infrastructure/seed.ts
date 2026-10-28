import type { Clock } from '@/shared/domain/clock'
import type { IdGenerator } from '@/shared/domain/id'
import { YearMonth } from '@/shared/domain/yearMonth'
import type { DemoSeed, SeedItem } from '@/config/types'
import type { Expense } from '../domain/expense'

function place(items: readonly SeedItem[], month: YearMonth, lastDay: number, newId: IdGenerator): Expense[] {
  return items.map((item) => ({
    id: newId(),
    categoryId: item.categoryId,
    amount: item.amount,
    date: month.dayIso(1 + Math.round(item.at * (lastDay - 1))),
    description: item.description,
  }))
}

/**
 * Demo expenses generated relative to the clock so the demo always tells the same
 * story about "this month" and "last month", whatever today's date is. Current-month
 * items never land after today.
 */
export function generateSeedExpenses(seed: DemoSeed, clock: Clock, newId: IdGenerator): Expense[] {
  const now = clock.now()
  const current = YearMonth.fromDate(now)
  const previous = current.previous()
  return [
    ...place(seed.previousMonth, previous, previous.daysInMonth(), newId),
    ...place(seed.currentMonth, current, now.getDate(), newId),
  ]
}
