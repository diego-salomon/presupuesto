import type { ExpenseRepository } from '../domain/ports'

export function deleteExpense(repo: ExpenseRepository, id: string): boolean {
  return repo.remove(id)
}
