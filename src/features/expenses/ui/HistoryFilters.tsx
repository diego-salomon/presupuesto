import type { Category } from '@/features/budgets/domain/category'
import { Button } from '@/shared/ui/Button'
import { Field, Input, Select } from '@/shared/ui/fields'
import type { HistoryFilters as Filters } from '../application/queryHistory'

export interface HistoryFiltersProps {
  categories: readonly Category[]
  value: Filters
  onChange: (next: Filters) => void
}

export function HistoryFilters({ categories, value, onChange }: HistoryFiltersProps) {
  const patch = (part: Partial<Filters>) => onChange({ ...value, ...part })
  const hasAny = !!(value.categoryId || value.from || value.to || value.search)

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Field label="Buscar en descripción" htmlFor="f-search">
        <Input
          id="f-search"
          type="search"
          placeholder="Ej. electricidad"
          value={value.search ?? ''}
          onChange={(e) => patch({ search: e.target.value || undefined })}
        />
      </Field>

      <Field label="Categoría" htmlFor="f-category">
        <Select id="f-category" value={value.categoryId ?? ''} onChange={(e) => patch({ categoryId: e.target.value || undefined })}>
          <option value="">Todas</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Desde" htmlFor="f-from">
        <Input id="f-from" type="date" value={value.from ?? ''} onChange={(e) => patch({ from: e.target.value || undefined })} />
      </Field>

      <Field label="Hasta" htmlFor="f-to">
        <Input id="f-to" type="date" value={value.to ?? ''} onChange={(e) => patch({ to: e.target.value || undefined })} />
      </Field>

      {hasAny && (
        <div className="sm:col-span-2 lg:col-span-4">
          <Button variant="ghost" onClick={() => onChange({})}>
            Limpiar filtros
          </Button>
        </div>
      )}
    </div>
  )
}
