import { Card } from '@/shared/ui/Card'
import { ProgressBar } from '@/shared/ui/ProgressBar'
import { useFormat } from '@/shared/ui/useFormat'
import type { CategorySummary } from '../domain/categorySummary'
import { StatusBadge } from './StatusBadge'

export function CategoryCard({ summary }: { summary: CategorySummary }) {
  const f = useFormat()
  return (
    <Card data-testid={`cat-${summary.categoryId}`} className="flex flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold leading-tight">{summary.name}</h3>
        <StatusBadge status={summary.status} />
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xl font-bold tabular-nums">{f.money(summary.spent)}</span>
        <span className="text-sm text-muted-foreground">de {f.money(summary.budget)}</span>
      </div>

      <ProgressBar
        percent={summary.barPercent}
        status={summary.status}
        label={`${summary.name}: ${f.percent(summary.percent)} del presupuesto`}
      />

      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground tabular-nums">{f.percent(summary.percent)}</span>
        {summary.overrun > 0 ? (
          <span className="font-medium text-exceeded-text tabular-nums">{f.money(summary.overrun)} por encima</span>
        ) : (
          <span className="text-muted-foreground tabular-nums">Quedan {f.money(summary.remaining)}</span>
        )}
      </div>
    </Card>
  )
}
