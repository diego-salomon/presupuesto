import { describe, expect, it } from 'vitest'
import { checkAdminPassword } from './auth'

describe('checkAdminPassword', () => {
  it('accepts the exact configured password', () => {
    expect(checkAdminPassword('clave-123', 'clave-123')).toBe(true)
  })

  it.each(['', ' ', 'Clave-123', 'clave-123 ', 'clave', '123'])('rejects %j', (attempt) => {
    expect(checkAdminPassword(attempt, 'clave-123')).toBe(false)
  })
})
