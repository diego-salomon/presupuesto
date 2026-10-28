export interface AdminCredentials {
  /** Required by the live (Supabase Auth) adapter; ignored by the demo gate. */
  email?: string
  password: string
}

/**
 * The admin-access seam. The demo adapter compares a password in the browser;
 * the live adapter signs in through Supabase Auth. One interface the UI can
 * await; `requiresEmail` tells the login form whether to ask for an email.
 */
export interface AdminGate {
  readonly requiresEmail: boolean
  isUnlocked(): boolean
  unlock(credentials: AdminCredentials): Promise<boolean>
  lock(): void | Promise<void>
  subscribe(listener: () => void): () => void
}
