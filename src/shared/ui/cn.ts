/** Joins truthy class names. Small on purpose: no dependency for this. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}
