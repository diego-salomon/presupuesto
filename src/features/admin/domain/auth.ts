/**
 * DEMO BUILD ONLY. In demo mode the admin area is protected by a plain password
 * compared in the browser — this is NOT real security, just a gate so the demo
 * data is not edited by accident. Live mode uses Supabase Auth instead (see the
 * SupabaseAdminGate), and the login screen says as much.
 */
export function checkAdminPassword(attempt: string, expected: string): boolean {
  return attempt === expected
}
