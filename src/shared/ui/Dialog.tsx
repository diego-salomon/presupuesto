import { useEffect, type ReactNode } from 'react'

/** Minimal accessible modal: overlay + Escape to close + labelled dialog role. */
export function Dialog({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label={title} className="relative z-10 w-full max-w-sm rounded-lg border bg-card p-5 shadow-lg">
        {children}
      </div>
    </div>
  )
}
