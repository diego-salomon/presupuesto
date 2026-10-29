import type { CategoryIndex } from '@/features/budgets/domain/category'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { useFormat } from '@/shared/ui/useFormat'
import type { Expense } from '../domain/expense'

export interface ExpenseListProps {
  items: readonly Expense[]
  categoryIndex: CategoryIndex
  onEdit?: (expense: Expense) => void
  onDelete?: (expense: Expense) => void
  emptyLabel?: string
}

export function ExpenseList({ items, categoryIndex, onEdit, onDelete, emptyLabel }: ExpenseListProps) {
  const f = useFormat()

  if (items.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">{emptyLabel ?? 'No hay gastos para mostrar.'}</p>
  }

  return (
    <ul className="flex flex-col gap-2">
      {items.map((expense) => (
        <li key={expense.id}>
          <Card className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 p-3">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{expense.description || categoryIndex.getCategory(expense.categoryId).name}</p>
              <p className="text-xs text-muted-foreground">
                {categoryIndex.getCategory(expense.categoryId).name} · {f.date(expense.date)}
              </p>
            </div>
            <span className="font-semibold tabular-nums">{f.money(expense.amount)}</span>
            {(onEdit || onDelete) && (
              <div className="flex gap-1">
                {onEdit && (
                  <Button variant="ghost" className="px-3" onClick={() => onEdit(expense)} aria-label={`Editar ${expense.description || 'gasto'}`}>
                    Editar
                  </Button>
                )}
                {onDelete && (
                  <Button variant="ghost" className="px-3 text-exceeded-text" onClick={() => onDelete(expense)} aria-label={`Eliminar ${expense.description || 'gasto'}`}>
                    Eliminar
                  </Button>
                )}
              </div>
            )}
          </Card>
        </li>
      ))}
    </ul>
  )
}
