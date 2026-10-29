import { useState } from 'react'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { Field, Input } from '@/shared/ui/fields'
import { useContainer } from '@/app/AppContext'

export function AdminLogin() {
  const { admin, adminHint } = useContainer()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    const ok = await admin.unlock({ email: email || undefined, password })
    setBusy(false)
    if (!ok) setError('Credenciales incorrectas.')
  }

  const disabled = busy || !password || (admin.requiresEmail && !email)

  return (
    <Card className="mx-auto max-w-sm p-5">
      <h1 className="text-xl font-bold">Administración</h1>
      <p className="mt-1 text-sm text-muted-foreground">Área protegida para editar presupuestos.</p>
      <form onSubmit={submit} noValidate className="mt-4 flex flex-col gap-4">
        {admin.requiresEmail && (
          <Field label="Correo" htmlFor="admin-email">
            <Input id="admin-email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
        )}
        <Field label="Contraseña" htmlFor="admin-password" error={error}>
          <Input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={!!error}
            aria-describedby={error ? 'admin-password-error' : undefined}
          />
        </Field>
        <Button type="submit" disabled={disabled}>
          {busy ? 'Entrando…' : 'Entrar'}
        </Button>
      </form>
      {adminHint && (
        <p className="mt-4 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
          Esto no es seguridad real, solo una puerta para la demo. Clave de demostración: <code className="font-semibold">{adminHint}</code>
        </p>
      )}
    </Card>
  )
}
