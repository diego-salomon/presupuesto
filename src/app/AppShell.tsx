import { NavLink, Outlet } from 'react-router-dom'
import { cn } from '@/shared/ui/cn'
import { useContainer } from '@/app/AppContext'

const NAV = [
  { to: '/', label: 'Resumen', end: true },
  { to: '/gastos/nuevo', label: 'Registrar' },
  { to: '/historial', label: 'Historial' },
  { to: '/anterior', label: 'Mes anterior' },
  { to: '/negocio', label: 'Negocio' },
  { to: '/admin', label: 'Admin' },
]

export function AppShell() {
  const { brand } = useContainer()
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            {brand.logoUrl && <img src={brand.logoUrl} alt="" className="h-7 w-7 rounded" />}
            <span className="text-base font-bold tracking-tight">{brand.name}</span>
          </div>
          <nav aria-label="Navegación principal" className="flex flex-wrap gap-1">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'inline-flex min-h-11 items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        <Outlet />
      </main>

      <footer className="border-t">
        <div className="mx-auto max-w-5xl px-4 py-4 text-xs text-muted-foreground">
          {brand.name} · {brand.tagline}
        </div>
      </footer>
    </div>
  )
}
