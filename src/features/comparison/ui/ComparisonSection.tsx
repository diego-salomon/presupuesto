import { Card } from '@/shared/ui/Card'
import { cn } from '@/shared/ui/cn'
import { useFormat } from '@/shared/ui/useFormat'
import type { MonthComparison } from '../application/compareMonths'

function Delta({ value, money }: { value: number; money: (n: number) => string }) {
  if (value === 0) return <span className="tabular-nums text-muted-foreground">—</span>
  const up = value > 0
  return (
    <span className={cn('tabular-nums font-medium', up ? 'text-exceeded-text' : 'text-ok-text')}>
      {up ? '+' : '−'}
      {money(Math.abs(value))}
    </span>
  )
}

export function ComparisonSection({ comparison }: { comparison: MonthComparison }) {
  const f = useFormat()
  return (
    <Card className="overflow-hidden">
      <div className="border-b px-4 py-3">
        <h2 className="font-semibold">Comparación con el mes actual</h2>
        <p className="text-xs text-muted-foreground">Diferencia de gasto por categoría (actual − anterior).</p>
      </div>
      <ul className="divide-y">
        {comparison.rows.map((row) => (
          <li key={row.categoryId} className="flex items-center justify-between gap-4 px-4 py-2.5 text-sm">
            <span className="min-w-0 flex-1 truncate">{row.name}</span>
            <span className="tabular-nums text-muted-foreground">{f.money(row.previous)}</span>
            <span className="hidden tabular-nums text-muted-foreground sm:inline">{f.money(row.current)}</span>
            <Delta value={row.delta} money={f.money} />
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between border-t px-4 py-3 text-sm font-semibold">
        <span>Diferencia total</span>
        <Delta value={comparison.totalDelta} money={f.money} />
      </div>
    </Card>
  )
}
