import type { PresupuestoConfig } from './types'

/**
 * WHITE-LABEL FILE 2 of 2 — the budget model.
 * Categories, their default monthly budgets, the warning threshold and the demo
 * example data. Category ids are free strings; keep them stable once a client
 * has real data. Amounts are whole currency units (no decimals).
 */
export const presupuesto: PresupuestoConfig = {
  storageNamespace: 'presupuesto.v1',
  warningPercent: 80,

  categories: [
    { id: 'insumos', name: 'Insumos y mercadería' },
    { id: 'servicios', name: 'Servicios (luz, agua, internet)' },
    { id: 'personal', name: 'Personal y sueldos' },
    { id: 'marketing', name: 'Marketing y publicidad' },
    { id: 'mantenimiento', name: 'Mantenimiento y limpieza' },
  ],

  defaultBudgets: {
    insumos: 90000,
    servicios: 35000,
    personal: 150000,
    marketing: 60000,
    mantenimiento: 25000,
  },

  admin: {
    demoPassword: 'presupuesto2026',
    showDemoHint: true,
  },

  // Story: this month ran a campaign, so Marketing is over budget and Insumos is
  // near its limit; everything else is comfortable. Last month was all within budget.
  demoSeed: {
    currentMonth: [
      { categoryId: 'personal', amount: 62000, description: 'Sueldo del equipo', at: 0 },
      { categoryId: 'servicios', amount: 14200, description: 'Electricidad (CFE)', at: 0.05 },
      { categoryId: 'insumos', amount: 21500, description: 'Mercadería y materiales — proveedor principal', at: 0.1 },
      { categoryId: 'marketing', amount: 25000, description: 'Campaña de anuncios en redes sociales', at: 0.15 },
      { categoryId: 'servicios', amount: 6800, description: 'Agua', at: 0.2 },
      { categoryId: 'insumos', amount: 24000, description: 'Reposición de inventario', at: 0.28 },
      { categoryId: 'marketing', amount: 22000, description: 'Diseño gráfico y contenido', at: 0.35 },
      { categoryId: 'insumos', amount: 9800, description: 'Empaques y bolsas', at: 0.42 },
      { categoryId: 'mantenimiento', amount: 8000, description: 'Limpieza del local', at: 0.5 },
      { categoryId: 'personal', amount: 18000, description: 'Horas extra (fin de semana)', at: 0.58 },
      { categoryId: 'servicios', amount: 5500, description: 'Internet y telefonía', at: 0.64 },
      { categoryId: 'insumos', amount: 8700, description: 'Insumos de oficina', at: 0.72 },
      { categoryId: 'marketing', amount: 20000, description: 'Impresión de folletos', at: 0.8 },
      { categoryId: 'mantenimiento', amount: 6500, description: 'Reparaciones menores', at: 0.86 },
      { categoryId: 'personal', amount: 18000, description: 'Bono de productividad', at: 0.92 },
      { categoryId: 'insumos', amount: 14000, description: 'Mercadería adicional por demanda', at: 1 },
    ],
    previousMonth: [
      { categoryId: 'personal', amount: 62000, description: 'Sueldo del equipo', at: 0 },
      { categoryId: 'servicios', amount: 13100, description: 'Electricidad (CFE)', at: 0.1 },
      { categoryId: 'insumos', amount: 16500, description: 'Mercadería y materiales — proveedor principal', at: 0.18 },
      { categoryId: 'marketing', amount: 18000, description: 'Campaña de anuncios en redes sociales', at: 0.26 },
      { categoryId: 'servicios', amount: 6400, description: 'Agua', at: 0.34 },
      { categoryId: 'insumos', amount: 9200, description: 'Empaques y bolsas', at: 0.42 },
      { categoryId: 'marketing', amount: 16000, description: 'Diseño gráfico y contenido', at: 0.5 },
      { categoryId: 'personal', amount: 18000, description: 'Horas extra (fin de semana)', at: 0.58 },
      { categoryId: 'servicios', amount: 5200, description: 'Internet y telefonía', at: 0.66 },
      { categoryId: 'insumos', amount: 7300, description: 'Insumos de oficina', at: 0.74 },
      { categoryId: 'mantenimiento', amount: 7000, description: 'Limpieza del local', at: 0.85 },
      { categoryId: 'insumos', amount: 11000, description: 'Mercadería adicional', at: 1 },
    ],
  },
}
