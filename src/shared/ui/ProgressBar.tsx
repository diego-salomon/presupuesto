import type { BudgetStatus } from '@/features/budgets/domain/budgetStatus'
import { cn } from './cn'

const fill: Record<BudgetStatus, string> = {
  ok: 'bg-ok',
  warning: 'bg-warning',
  exceeded: 'bg-exceeded',
}

export function ProgressBar({ percent, status, label }: { percent: number; status: BudgetStatus; label?: string }) {
  const width = Math.max(0, Math.min(100, Number.isFinite(percent) ? percent : 100))
  return (
    <div
      className="h-2.5 w-full overflow-hidden rounded-full bg-track"
      role="progressbar"
      aria-valuenow={Math.round(width)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div className={cn('h-full rounded-full transition-[width] duration-500', fill[status])} style={{ width: `${width}%` }} />
    </div>
  )
}
