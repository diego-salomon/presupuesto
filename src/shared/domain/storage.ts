/**
 * Port: the minimal synchronous key/value storage the repositories need.
 * `window.localStorage` and `window.sessionStorage` satisfy it as-is; tests pass
 * an in-memory fake. To move persistence elsewhere, implement the repositories
 * directly (see the Supabase adapters) rather than this low-level seam.
 */
export interface KeyValueStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}
