import { describe, expect, it } from 'vitest'
import { MemoryStorage } from '@/shared/infrastructure/memoryStorage'
import { DemoAdminGate } from './demoAdminGate'

const KEY = 'presupuesto.v1.admin-unlocked'
const PASSWORD = 'secreto'
const makeGate = (storage = new MemoryStorage()) => new DemoAdminGate({ storage, key: KEY, password: PASSWORD })

describe('DemoAdminGate', () => {
  it('starts locked and does not require an email', () => {
    const gate = makeGate()
    expect(gate.isUnlocked()).toBe(false)
    expect(gate.requiresEmail).toBe(false)
  })

  it('unlocks only with the right password', async () => {
    const gate = makeGate()
    expect(await gate.unlock({ password: 'mala' })).toBe(false)
    expect(gate.isUnlocked()).toBe(false)
    expect(await gate.unlock({ password: PASSWORD })).toBe(true)
    expect(gate.isUnlocked()).toBe(true)
  })

  it('persists the unlocked flag in the given storage and can be locked again', async () => {
    const storage = new MemoryStorage()
    await makeGate(storage).unlock({ password: PASSWORD })
    const reopened = makeGate(storage)
    expect(reopened.isUnlocked()).toBe(true)
    reopened.lock()
    expect(makeGate(storage).isUnlocked()).toBe(false)
  })

  it('notifies subscribers on change', async () => {
    const gate = makeGate()
    let calls = 0
    gate.subscribe(() => calls++)
    await gate.unlock({ password: PASSWORD })
    gate.lock()
    expect(calls).toBe(2)
  })
})
