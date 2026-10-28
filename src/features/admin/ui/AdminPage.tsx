import { useState } from 'react'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { Dialog } from '@/shared/ui/Dialog'
import { useAdminUnlocked, useContainer } from '@/app/AppContext'
import { AdminLogin } from './AdminLogin'
import { BudgetEditor } from './BudgetEditor'

export function AdminPage() {
  const unlocked = useAdminUnlocked()
  if (!unlocked) return <AdminLogin />
  return <AdminDashboard />
}

function AdminDashboard() {
  const container = useContainer()
  const [confirmReset, setConfirmReset] = useState(false)

  return (
    <section className="flex flex-col gap-5">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Administración</h2>
        <Button variant="ghost" onClick={() => void container.admin.lock()}>
          Cerrar sesión
        </Button>
      </header>

      <BudgetEditor />

      {container.mode === 'demo' && (
        <Card className="p-5">
          <h3 className="text-lg font-semibold">Datos de ejemplo</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Restaura los presupuestos por defecto y regenera los gastos de ejemplo.
          </p>
          <Button variant="danger" className="mt-4" onClick={() => setConfirmReset(true)}>
            Restablecer datos de ejemplo
          </Button>
        </Card>
      )}

      <Dialog open={confirmReset} onClose={() => setConfirmReset(false)} title="Restablecer datos de ejemplo">
        <h2 className="text-lg font-semibold">Restablecer datos de ejemplo</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Se reemplazarán todos los gastos actuales por los de ejemplo y se restaurarán los presupuestos por defecto.
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setConfirmReset(false)}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              container.resetDemo()
              setConfirmReset(false)
            }}
          >
            Restablecer
          </Button>
        </div>
      </Dialog>
    </section>
  )
}
