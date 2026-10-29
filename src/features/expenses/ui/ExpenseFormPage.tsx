import { useNavigate, useParams } from 'react-router-dom'
import { todayIso } from '@/shared/domain/clock'
import { useContainer, useExpenses } from '@/app/AppContext'
import { addExpense } from '../application/addExpense'
import { editExpense } from '../application/editExpense'
import type { ExpenseFormInput } from '../domain/expense'
import { ExpenseForm } from './ExpenseForm'

export function ExpenseFormPage() {
  const container = useContainer()
  const navigate = useNavigate()
  const { id } = useParams()
  const expenses = useExpenses()
  const editing = id ? expenses.find((x) => x.id === id) : undefined

  if (id && !editing) {
    return (
      <section className="py-8 text-center">
        <p className="text-muted-foreground">No se encontró el gasto.</p>
      </section>
    )
  }

  const initial: ExpenseFormInput = editing
    ? { categoryId: editing.categoryId, amount: String(editing.amount), date: editing.date, description: editing.description }
    : { categoryId: '', amount: '', date: todayIso(container.clock), description: '' }

  const onSubmit = (input: ExpenseFormInput) => {
    const result = editing
      ? editExpense({ repo: container.expenses, validation: container.validation }, editing.id, input)
      : addExpense({ repo: container.expenses, newId: container.newId, validation: container.validation }, input)
    if (result.ok) navigate('/')
    return result
  }

  return (
    <section className="mx-auto max-w-xl">
      <h1 className="mb-1 text-2xl font-bold tracking-tight">{editing ? 'Editar gasto' : 'Registrar gasto'}</h1>
      <p className="mb-5 text-sm text-muted-foreground">
        {editing ? 'Modifica los datos del gasto.' : 'Agrega un gasto y el total del mes se actualiza al instante.'}
      </p>
      <ExpenseForm
        categories={container.categories}
        initial={initial}
        submitLabel={editing ? 'Guardar cambios' : 'Agregar gasto'}
        currencySymbol={container.formats.currency.symbol}
        onSubmit={onSubmit}
        onCancel={() => navigate(-1)}
      />
    </section>
  )
}
