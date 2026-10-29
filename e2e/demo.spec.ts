import { test, expect, type Page } from '@playwright/test'

// Start every test from a clean, un-seeded demo (empty data, seed suppressed),
// so totals and statuses are deterministic regardless of the machine's date.
async function freshApp(page: Page) {
  await page.addInitScript(() => {
    try {
      window.localStorage.setItem('presupuesto.v1.expenses', '[]')
      window.localStorage.setItem('presupuesto.v1.seeded', '1')
      window.localStorage.removeItem('presupuesto.v1.budgets')
    } catch {
      /* ignore */
    }
  })
  await page.goto('/')
}

function iso(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

async function addExpense(page: Page, category: string, amount: string, date?: string) {
  await page.getByRole('link', { name: 'Registrar' }).click()
  await page.getByLabel('Categoría').selectOption({ label: category })
  await page.getByLabel('Monto').fill(amount)
  if (date) await page.getByLabel('Fecha').fill(date)
  await page.getByRole('button', { name: 'Agregar gasto' }).click()
  await expect(page.getByRole('heading', { name: 'Resumen del mes' })).toBeVisible()
}

test('add expense updates the category total and keeps an ok status', async ({ page }) => {
  await freshApp(page)
  // A fresh client sees the onboarding empty state, not a zeroed dashboard.
  await expect(page.getByText('Aún no hay gastos')).toBeVisible()

  await addExpense(page, 'Servicios (luz, agua, internet)', '10000')

  await expect(page.getByTestId('month-total')).toHaveText('$10,000')
  const card = page.getByTestId('cat-servicios')
  await expect(card).toContainText('$10,000')
  await expect(card).toContainText('En presupuesto')
})

test('crossing 80% turns the category into a warning', async ({ page }) => {
  await freshApp(page)
  // Servicios default budget is 35,000; 28,000 is exactly 80%.
  await addExpense(page, 'Servicios (luz, agua, internet)', '28000')
  await expect(page.getByTestId('cat-servicios')).toContainText('Cerca del límite')
})

test('exceeding the budget turns the category red and shows the alert', async ({ page }) => {
  await freshApp(page)
  await addExpense(page, 'Servicios (luz, agua, internet)', '40000')
  await expect(page.getByTestId('cat-servicios')).toContainText('Excedido')
  await expect(page.getByRole('alert')).toContainText('superó su presupuesto')
})

test('the month boundary isolates totals between months', async ({ page }) => {
  await freshApp(page)
  const now = new Date()
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 15)

  await addExpense(page, 'Personal y sueldos', '5000', iso(now))
  await addExpense(page, 'Personal y sueldos', '9999', iso(lastMonth))

  // Current month shows only this month's expense.
  await expect(page.getByTestId('month-total')).toHaveText('$5,000')

  // Previous month shows only last month's expense.
  await page.getByRole('link', { name: 'Mes anterior' }).click()
  await expect(page.getByTestId('month-total')).toHaveText('$9,999')
})
