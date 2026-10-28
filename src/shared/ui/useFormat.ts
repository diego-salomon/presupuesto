import { useMemo } from 'react'
import type { YearMonth } from '@/shared/domain/yearMonth'
import { useContainer } from '@/app/AppContext'
import { formatCurrency, formatIsoDate, formatPercent, monthLabel } from './formatters'

/** Formatting helpers bound to the configured locale + currency. */
export function useFormat() {
  const { formats } = useContainer()
  return useMemo(
    () => ({
      money: (amount: number) => formatCurrency(amount, formats.currency),
      date: (iso: string) => formatIsoDate(iso, formats.monthsShort),
      percent: formatPercent,
      month: (ym: YearMonth) => monthLabel(ym, formats.monthsLong),
    }),
    [formats],
  )
}
