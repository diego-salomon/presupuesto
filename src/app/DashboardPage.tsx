import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { useFormat } from '@/shared/ui/useFormat'
import { useCurrentMonth, useExpenses } from '@/app/AppContext'
import { CategoryGrid } from '@/features/budgets/ui/CategoryGrid'
import { MonthlyTotalCard } from '@/features/budgets/ui/MonthlyTotalCard'
import { useMonthlyOverview } from '@/features/budgets/ui/useMonthlyOverview'

export function DashboardPage() {
  const navigate = useNavigate()
  const month = useCurrentMonth()
  const overview = useMonthlyOverview(month)
  const expenses = useExpenses()
  const f = useFormat()
  const monthName = f.month(month)
  const isEmpty = expenses.length === 0

  return (
    <section className="flex flex-col gap-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Resumen del mes</h1>
          <p className="text-sm text-muted-foreground">{monthName}</p>
        </div>
        {!isEmpty && <Button onClick={() => navigate('/gastos/nuevo')}>+ Registrar gasto</Button>}
      </header>

      {isEmpty ? (
        <Card className="flex flex-col items-center gap-3 px-6 py-12 text-center">
          <h2 className="text-lg font-semibold">Aún no hay gastos</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Registra tu primer gasto y verás aquí el total del mes y cuánto llevas de cada presupuesto.
          </p>
          <Button className="mt-1" onClick={() => navigate('/gastos/nuevo')}>
            + Registrar el primer gasto
          </Button>
        </Card>
      ) : (
        <>
          <MonthlyTotalCard overview={overview} monthName={monthName} />
          <CategoryGrid categories={overview.categories} />
        </>
      )}
    </section>
  )
}
