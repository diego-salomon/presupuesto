import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from './cn'

const base =
  'w-full min-h-11 rounded-md border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-[invalid=true]:border-exceeded'

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(base, props.className)} {...props} />
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(base, props.className)} {...props} />
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(base, 'min-h-20', props.className)} {...props} />
}

export function Field({
  label,
  htmlFor,
  error,
  required,
  hint,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  required?: boolean
  hint?: string
  children: ReactNode
}) {
  const errorId = `${htmlFor}-error`
  const hintId = `${htmlFor}-hint`
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
        {required && (
          <span className="text-exceeded-text" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      {children}
      {hint && (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-exceeded-text">
          {error}
        </p>
      )}
    </div>
  )
}
