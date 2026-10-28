import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/ui/Button'
import { useFormat } from '@/shared/ui/useFormat'
import { useCurrentMonth } from '@/app/AppContext'
import { CategoryGrid } from '@/features/budgets/ui/CategoryGrid'
import { MonthlyTotalCard } from '@/features/budgets/ui/MonthlyTotalCard'
import { useMonthlyOverview } from '@/features/budgets/ui/useMonthlyOverview'

export function DashboardPage() {
  const navigate = useNavigate()
  const month = useCurrentMonth()
  const overview = useMonthlyOverview(month)
  const f = useFormat()
  const monthName = f.month(month)

  return (
    <section className="flex flex-col gap-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Resumen del mes</h2>
          <p className="text-sm text-muted-foreground">{monthName}</p>
        </div>
        <Button onClick={() => navigate('/gastos/nuevo')}>+ Registrar gasto</Button>
      </header>

      <MonthlyTotalCard overview={overview} monthName={monthName} />
      <CategoryGrid categories={overview.categories} />
    </section>
  )
}
