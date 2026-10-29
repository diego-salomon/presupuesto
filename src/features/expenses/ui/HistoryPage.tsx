import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContainer, useExpenses } from '@/app/AppContext'
import { useFormat } from '@/shared/ui/useFormat'
import { deleteExpense } from '../application/deleteExpense'
import { queryHistory, type HistoryFilters as Filters } from '../application/queryHistory'
import type { Expense } from '../domain/expense'
import { HistoryFilters } from './HistoryFilters'
import { ExpenseList } from './ExpenseList'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'

export function HistoryPage() {
  const container = useContainer()
  const navigate = useNavigate()
  const expenses = useExpenses()
  const f = useFormat()

  const [filters, setFilters] = useState<Filters>({})
  const [toDelete, setToDelete] = useState<Expense | null>(null)

  const result = useMemo(() => queryHistory(expenses, filters), [expenses, filters])

  return (
    <section className="flex flex-col gap-5">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Historial</h1>
        <p className="text-sm text-muted-foreground">Todos los gastos registrados. El historial nunca se borra.</p>
      </header>

      <HistoryFilters categories={container.categories} value={filters} onChange={setFilters} />

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span aria-live="polite">{result.count === 1 ? '1 gasto' : `${result.count} gastos`}</span>
        <span className="tabular-nums">Total: {f.money(result.total)}</span>
      </div>

      <ExpenseList
        items={result.items}
        categoryIndex={container.categoryIndex}
        onEdit={(e) => navigate(`/gastos/${e.id}/editar`)}
        onDelete={setToDelete}
        emptyLabel="No hay gastos que coincidan con los filtros."
      />

      <DeleteConfirmDialog
        expense={toDelete}
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) deleteExpense(container.expenses, toDelete.id)
          setToDelete(null)
        }}
      />
    </section>
  )
}
