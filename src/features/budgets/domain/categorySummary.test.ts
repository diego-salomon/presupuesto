import { describe, expect, it } from 'vitest'
import type { Category } from './category'
import { summarizeCategory } from './categorySummary'

const cat: Category = { id: 'insumos', name: 'Insumos y mercadería' }

describe('summarizeCategory', () => {
  it('reports remaining and bar for a healthy category', () => {
    const s = summarizeCategory(cat, 120000, 30000)
    expect(s).toMatchObject({
      categoryId: 'insumos',
      name: 'Insumos y mercadería',
      budget: 120000,
      spent: 30000,
      remaining: 90000,
      overrun: 0,
      percent: 25,
      barPercent: 25,
      status: 'ok',
    })
  })

  it('reports overrun and caps the bar at 100%', () => {
    const s = summarizeCategory(cat, 120000, 135000)
    expect(s.status).toBe('exceeded')
    expect(s.overrun).toBe(15000)
    expect(s.remaining).toBe(-15000)
    expect(s.percent).toBeCloseTo(112.5)
    expect(s.barPercent).toBe(100)
  })

  it('shows a full bar for a zero budget with spending', () => {
    const s = summarizeCategory(cat, 0, 500)
    expect(s.barPercent).toBe(100)
    expect(s.status).toBe('exceeded')
  })
})
