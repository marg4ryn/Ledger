import type { ExpenseStorage, Expense } from './types.js';

export const storage: ExpenseStorage = {
  save(expenses) {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  },

  load() {
    try {
      return JSON.parse(localStorage.getItem('expenses') ?? '[]') as Expense[];
    } catch (e) {
      console.error('Error during parsing JSON', e);
      return [] as Expense[];
    }
  },
};
