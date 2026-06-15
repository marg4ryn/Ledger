import { createStore } from '@framework/store.js';
import { storage } from '@app/storage.js';
import { SortBy, ExpenseStore } from './types.js';

export function createExpenseStore(initialStorage = storage) {
  const store = createStore<ExpenseStore>({
    expenses: initialStorage.load(),
    filter: '',
    sort: { by: 'name', asc: true },
  });

  const actions = {
    addExpense(name: string, price: number): void {
      store.set((state) => ({
        ...state,
        expenses: [
          ...state.expenses,
          {
            id: crypto.randomUUID(),
            name,
            price,
          },
        ],
      }));
      storage.save(store.get().expenses);
    },

    removeExpense(id: string): void {
      store.set((state) => ({
        ...state,
        expenses: state.expenses.filter((e) => e.id !== id),
      }));
      storage.save(store.get().expenses);
    },

    setFilter(value: string): void {
      store.set((state) => ({ ...state, filter: value }));
    },

    setSort(by: SortBy): void {
      store.set((state) => ({
        ...state,
        sort: {
          by,
          asc: state.sort.by === by ? !state.sort.asc : true,
        },
      }));
    },
  };

  return { store, actions };
}
