import type { BudgetStatus } from '../domain/budgetStatus'

export const STATUS_LABEL: Record<BudgetStatus, string> = {
  ok: 'En presupuesto',
  warning: 'Cerca del límite',
  exceeded: 'Excedido',
}

/** Solid, AA-contrast status pills. */
export const STATUS_BADGE: Record<BudgetStatus, string> = {
  ok: 'bg-ok text-ok-foreground',
  warning: 'bg-warning text-warning-foreground',
  exceeded: 'bg-exceeded text-exceeded-foreground',
}
