import { Card } from '@/shared/ui/Card'
import { ProgressBar } from '@/shared/ui/ProgressBar'
import { useFormat } from '@/shared/ui/useFormat'
import { percentOf } from '@/shared/domain/money'
import { useContainer } from '@/app/AppContext'
import { budgetStatus } from '../domain/budgetStatus'
import type { MonthlyOverview } from '../application/getMonthlyOverview'

export function MonthlyTotalCard({ overview, monthName }: { overview: MonthlyOverview; monthName: string }) {
  const f = useFormat()
  const { warningPercent } = useContainer()
  const status = budgetStatus(overview.total, overview.totalBudget, warningPercent)
  const percent = percentOf(overview.total, overview.totalBudget)

  return (
    <Card className="flex flex-col gap-4 p-5 sm:p-6">
      <div>
        <p className="text-sm text-muted-foreground">Gasto total · {monthName}</p>
        <p data-testid="month-total" className="mt-1 text-4xl font-bold tracking-tight tabular-nums sm:text-5xl">
          {f.money(overview.total)}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Presupuesto mensual {f.money(overview.totalBudget)} · {f.percent(percent)} usado
        </p>
      </div>

      <ProgressBar percent={Math.min(100, percent)} status={status} label={`Gasto total: ${f.percent(percent)} del presupuesto`} />

      {overview.exceededCount > 0 && (
        <div
          role="alert"
          className="rounded-md bg-exceeded px-3 py-2 text-sm font-medium text-exceeded-foreground"
        >
          {overview.exceededCount === 1
            ? '1 categoría superó su presupuesto'
            : `${overview.exceededCount} categorías superaron su presupuesto`}
        </div>
      )}
    </Card>
  )
}
