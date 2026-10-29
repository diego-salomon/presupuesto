import { useState } from 'react'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { Field, Input } from '@/shared/ui/fields'
import { useBudgets, useContainer } from '@/app/AppContext'
import type { Budgets } from '@/features/budgets/domain/category'
import { validateBudgetAmount } from '@/features/budgets/domain/validateBudget'

export function BudgetEditor() {
  const { categories, budgets: repo } = useContainer()
  const budgets = useBudgets()
  const [draft, setDraft] = useState<Record<string, string>>(() =>
    Object.fromEntries(categories.map((c) => [c.id, String(budgets[c.id] ?? 0)])),
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    const next: Budgets = { ...budgets }
    const nextErrors: Record<string, string> = {}
    for (const category of categories) {
      const result = validateBudgetAmount(Number(draft[category.id]))
      if (!result.ok) nextErrors[category.id] = result.errors.amount ?? 'Valor inválido.'
      else next[category.id] = result.value
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setSaved(false)
      return
    }
    setErrors({})
    repo.set(next)
    setSaved(true)
  }

  return (
    <Card className="p-5">
      <h2 className="text-lg font-semibold">Presupuestos por categoría</h2>
      <p className="mt-1 text-sm text-muted-foreground">Montos enteros, sin decimales. Aplican a todos los meses.</p>
      <form onSubmit={save} noValidate className="mt-4 flex flex-col gap-4">
        {categories.map((category) => (
          <Field key={category.id} label={category.name} htmlFor={`budget-${category.id}`} error={errors[category.id]}>
            <Input
              id={`budget-${category.id}`}
              inputMode="numeric"
              type="number"
              min={1}
              step={1}
              value={draft[category.id] ?? ''}
              onChange={(e) => {
                setDraft((prev) => ({ ...prev, [category.id]: e.target.value }))
                setSaved(false)
              }}
              aria-invalid={!!errors[category.id]}
            />
          </Field>
        ))}
        <div className="flex items-center gap-3">
          <Button type="submit">Guardar presupuestos</Button>
          {saved && (
            <span role="status" className="text-sm font-medium text-ok-text">
              Guardado
            </span>
          )}
        </div>
      </form>
    </Card>
  )
}
