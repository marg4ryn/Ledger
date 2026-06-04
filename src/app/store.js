import { createStore } from '@framework/store.js';
import { storage } from '@app/storage.js';

export const store = createStore({
  expenses: storage.load(),
  filter: '',
  sort: { by: 'name', asc: true },
});

export const actions = {
  addExpense(name, price) {
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

  removeExpense(id) {
    store.set((state) => ({
      ...state,
      expenses: state.expenses.filter((e) => e.id !== id),
    }));
    storage.save(store.get().expenses);
  },

  setFilter(value) {
    store.set((state) => ({ ...state, filter: value }));
  },

  setSort(by) {
    store.set((state) => ({
      ...state,
      sort: {
        by,
        asc: state.sort.by === by ? !state.sort.asc : true,
      },
    }));
  },
};
