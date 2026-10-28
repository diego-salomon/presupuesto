import { Route, Routes } from 'react-router-dom'
import { AppShell } from './AppShell'
import { DashboardPage } from './DashboardPage'
import { ExpenseFormPage } from '@/features/expenses/ui/ExpenseFormPage'
import { HistoryPage } from '@/features/expenses/ui/HistoryPage'
import { PreviousMonthPage } from '@/features/comparison/ui/PreviousMonthPage'
import { BusinessInfoPage } from '@/features/business-info/ui/BusinessInfoPage'
import { AdminPage } from '@/features/admin/ui/AdminPage'

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<DashboardPage />} />
        <Route path="gastos/nuevo" element={<ExpenseFormPage />} />
        <Route path="gastos/:id/editar" element={<ExpenseFormPage />} />
        <Route path="historial" element={<HistoryPage />} />
        <Route path="anterior" element={<PreviousMonthPage />} />
        <Route path="negocio" element={<BusinessInfoPage />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="*" element={<p className="py-12 text-center text-muted-foreground">Página no encontrada.</p>} />
      </Route>
    </Routes>
  )
}
