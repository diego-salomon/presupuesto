import { Button } from '@/shared/ui/Button'
import { Dialog } from '@/shared/ui/Dialog'
import { useFormat } from '@/shared/ui/useFormat'
import type { Expense } from '../domain/expense'

export function DeleteConfirmDialog({
  expense,
  onConfirm,
  onCancel,
}: {
  expense: Expense | null
  onConfirm: () => void
  onCancel: () => void
}) {
  const f = useFormat()
  return (
    <Dialog open={!!expense} onClose={onCancel} title="Eliminar gasto">
      <h2 className="text-lg font-semibold">Eliminar gasto</h2>
      {expense && (
        <p className="mt-2 text-sm text-muted-foreground">
          ¿Eliminar «{expense.description || 'gasto'}» por {f.money(expense.amount)}? Esta acción no se puede deshacer.
        </p>
      )}
      <div className="mt-5 flex justify-end gap-3">
        <Button variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Eliminar
        </Button>
      </div>
    </Dialog>
  )
}
