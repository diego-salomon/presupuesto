import { createContext, useContext, useSyncExternalStore, type ReactNode } from 'react'
import { currentYearMonth } from '@/shared/domain/clock'
import type { YearMonth } from '@/shared/domain/yearMonth'
import type { Container } from './container'

const ContainerContext = createContext<Container | null>(null)

export function ContainerProvider({ container, children }: { container: Container; children: ReactNode }) {
  return <ContainerContext.Provider value={container}>{children}</ContainerContext.Provider>
}

export function useContainer(): Container {
  const container = useContext(ContainerContext)
  if (!container) throw new Error('useContainer must be used within a ContainerProvider')
  return container
}

/** Live view of all expenses; re-renders when any are added, edited or removed. */
export function useExpenses() {
  const { expenses } = useContainer()
  return useSyncExternalStore(
    (cb) => expenses.subscribe(cb),
    () => expenses.list(),
    () => expenses.list(),
  )
}

/** Live view of the budgets map. */
export function useBudgets() {
  const { budgets } = useContainer()
  return useSyncExternalStore(
    (cb) => budgets.subscribe(cb),
    () => budgets.get(),
    () => budgets.get(),
  )
}

/** Live admin unlocked state. */
export function useAdminUnlocked(): boolean {
  const { admin } = useContainer()
  return useSyncExternalStore(
    (cb) => admin.subscribe(cb),
    () => admin.isUnlocked(),
    () => admin.isUnlocked(),
  )
}

export function useCurrentMonth(): YearMonth {
  return currentYearMonth(useContainer().clock)
}
