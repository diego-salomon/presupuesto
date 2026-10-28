import type { KeyValueStorage } from '@/shared/domain/storage'
import { checkAdminPassword } from '../domain/auth'
import type { AdminCredentials, AdminGate } from '../domain/ports'

export interface DemoAdminDeps {
  storage: KeyValueStorage
  key: string
  password: string
}

/** DEMO gate: keeps an "unlocked" flag in sessionStorage (cleared when the tab closes). */
export class DemoAdminGate implements AdminGate {
  readonly requiresEmail = false
  private readonly listeners = new Set<() => void>()

  constructor(private readonly deps: DemoAdminDeps) {}

  isUnlocked(): boolean {
    return this.deps.storage.getItem(this.deps.key) === '1'
  }

  unlock(credentials: AdminCredentials): Promise<boolean> {
    if (!checkAdminPassword(credentials.password, this.deps.password)) return Promise.resolve(false)
    this.deps.storage.setItem(this.deps.key, '1')
    this.emit()
    return Promise.resolve(true)
  }

  lock(): void {
    this.deps.storage.removeItem(this.deps.key)
    this.emit()
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private emit(): void {
    this.listeners.forEach((l) => l())
  }
}
