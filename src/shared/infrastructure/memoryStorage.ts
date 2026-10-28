import type { KeyValueStorage } from '@/shared/domain/storage'

/** In-memory KeyValueStorage for tests (stands in for window.localStorage). */
export class MemoryStorage implements KeyValueStorage {
  private readonly data = new Map<string, string>()

  getItem(key: string): string | null {
    return this.data.get(key) ?? null
  }

  setItem(key: string, value: string): void {
    this.data.set(key, value)
  }

  removeItem(key: string): void {
    this.data.delete(key)
  }
}
