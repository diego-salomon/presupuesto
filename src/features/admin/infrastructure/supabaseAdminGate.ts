import type { SupabaseClient } from '@supabase/supabase-js'
import type { AdminCredentials, AdminGate } from '../domain/ports'

/** LIVE gate: real sign-in through Supabase Auth. The signed-in session is the unlock. */
export class SupabaseAdminGate implements AdminGate {
  readonly requiresEmail = true
  private unlocked = false
  private readonly listeners = new Set<() => void>()

  constructor(private readonly sb: SupabaseClient) {}

  isUnlocked(): boolean {
    return this.unlocked
  }

  async unlock({ email, password }: AdminCredentials): Promise<boolean> {
    if (!email) return false
    const { error } = await this.sb.auth.signInWithPassword({ email, password })
    if (error) return false
    this.unlocked = true
    this.emit()
    return true
  }

  async lock(): Promise<void> {
    await this.sb.auth.signOut()
    this.unlocked = false
    this.emit()
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  /** Restores any existing session and keeps the unlocked flag in sync with auth. */
  async hydrate(): Promise<void> {
    const { data } = await this.sb.auth.getSession()
    this.unlocked = !!data.session
    this.emit()
    this.sb.auth.onAuthStateChange((_event, session) => {
      this.unlocked = !!session
      this.emit()
    })
  }

  private emit(): void {
    this.listeners.forEach((l) => l())
  }
}
