import { useState } from 'react'
import type { Category } from '@/features/budgets/domain/category'
import { Button } from '@/shared/ui/Button'
import { Field, Input, Select, Textarea } from '@/shared/ui/fields'
import type { Result } from '@/shared/domain/result'
import { MAX_DESCRIPTION_LENGTH } from '../domain/validateExpense'
import type { ExpenseField, ExpenseFormInput } from '../domain/expense'

export interface ExpenseFormProps {
  categories: readonly Category[]
  initial: ExpenseFormInput
  submitLabel: string
  onSubmit: (input: ExpenseFormInput) => Result<unknown, ExpenseField | 'general'>
  onCancel?: () => void
}

const EMPTY: Partial<Record<ExpenseField | 'general', string>> = {}

export function ExpenseForm({ categories, initial, submitLabel, onSubmit, onCancel }: ExpenseFormProps) {
  const [input, setInput] = useState<ExpenseFormInput>(initial)
  const [errors, setErrors] = useState(EMPTY)

  const set = (field: keyof ExpenseFormInput, value: string) => setInput((prev) => ({ ...prev, [field]: value }))
  const requiredMissing = !input.categoryId || !input.amount.trim() || !input.date

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const result = onSubmit(input)
    if (!result.ok) {
      setErrors(result.errors)
      return
    }
    setErrors(EMPTY)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <Field label="Categoría" htmlFor="categoryId" required error={errors.categoryId}>
        <Select
          id="categoryId"
          value={input.categoryId}
          onChange={(e) => set('categoryId', e.target.value)}
          aria-invalid={!!errors.categoryId}
          aria-describedby={errors.categoryId ? 'categoryId-error' : undefined}
        >
          <option value="">Seleccione una categoría…</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Monto" htmlFor="amount" required error={errors.amount} hint="Solo números enteros, sin decimales.">
        <Input
          id="amount"
          inputMode="numeric"
          autoComplete="off"
          value={input.amount}
          onChange={(e) => set('amount', e.target.value)}
          aria-invalid={!!errors.amount}
          aria-describedby={errors.amount ? 'amount-error' : 'amount-hint'}
        />
      </Field>

      <Field label="Fecha" htmlFor="date" required error={errors.date}>
        <Input
          id="date"
          type="date"
          value={input.date}
          onChange={(e) => set('date', e.target.value)}
          aria-invalid={!!errors.date}
          aria-describedby={errors.date ? 'date-error' : undefined}
        />
      </Field>

      <Field label="Descripción" htmlFor="description" error={errors.description} hint="Opcional.">
        <Textarea
          id="description"
          maxLength={MAX_DESCRIPTION_LENGTH}
          value={input.description}
          onChange={(e) => set('description', e.target.value)}
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? 'description-error' : 'description-hint'}
        />
      </Field>

      {errors.general && (
        <p role="alert" className="text-sm font-medium text-exceeded">
          {errors.general}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={requiredMissing}>
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  )
}
