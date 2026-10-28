import { cn } from '@/shared/ui/cn'
import type { BudgetStatus } from '../domain/budgetStatus'
import { STATUS_BADGE, STATUS_LABEL } from './statusStyles'

export function StatusBadge({ status }: { status: BudgetStatus }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold', STATUS_BADGE[status])}>
      {STATUS_LABEL[status]}
    </span>
  )
}
