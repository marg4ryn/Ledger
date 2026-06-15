import { describe, it, vi, expect, beforeEach } from 'vitest';
import { createExpenseStore } from '../../src/app/store.js';
import type { ExpenseStorage, Expense } from '../../src/app/types.js';

function makeStorage(initial: Expense[] = []): ExpenseStorage {
  let expenses = initial;
  return {
    load: vi.fn(() => expenses),
    save: vi.fn((data) => {
      expenses = data;
    }),
  };
}

describe('createExpenseStore', () => {
  describe('initial state', () => {
    it('loads expenses from storage', () => {
      const stored = [{ id: '1', name: 'Expense', price: 5 }];
      const { store } = createExpenseStore(makeStorage(stored));

      expect(store.get().expenses).toEqual(stored);
    });

    it('sets default filter and sort', () => {
      const { store } = createExpenseStore(makeStorage());

      expect(store.get().filter).toBe('');
      expect(store.get().sort).toEqual({ by: 'name', asc: true });
    });
  });

  describe('addExpense', () => {
    it('adds expense with given name and price', () => {
      const { store, actions } = createExpenseStore(makeStorage());

      actions.addExpense('foo', 42);

      expect(store.get().expenses[0]).toMatchObject({ name: 'foo', price: 42 });
    });

    it('generates unique id for each expense', () => {
      const { store, actions } = createExpenseStore(makeStorage());

      actions.addExpense('foo', 1);
      actions.addExpense('bar', 2);

      const [a, b] = store.get().expenses;
      expect(a.id).not.toBe(b.id);
    });

    it('saves to starage after adding', () => {
      const storage = makeStorage();
      const { store, actions } = createExpenseStore(storage);

      actions.addExpense('foo', 1);

      expect(storage.save).toHaveBeenCalledWith(store.get().expenses);
    });
  });

  describe('removeExpense', () => {
    it('removes expense by id', () => {
      const { store, actions } = createExpenseStore(makeStorage());
      actions.addExpense('foo', 1);
      const id = store.get().expenses[0].id;

      actions.removeExpense(id);

      expect(store.get().expenses).toHaveLength(0);
    });

    it('saves to storage after removal', () => {
      const storage = makeStorage();
      const { store, actions } = createExpenseStore(storage);
      actions.addExpense('foo', 1);
      const id = store.get().expenses[0].id;

      actions.removeExpense(id);

      expect(storage.save).toHaveBeenCalledWith(store.get().expenses);
    });

    it('does not affect other expenses', () => {
      const { store, actions } = createExpenseStore(makeStorage());
      actions.addExpense('foo', 1);
      actions.addExpense('bar', 2);
      const id = store.get().expenses[0].id;

      actions.removeExpense(id);

      expect(store.get().expenses).toHaveLength(1);
      expect(store.get().expenses[0]).toMatchObject({ name: 'bar', price: 2 });
    });
  });

  describe('setFilter', () => {
    it('updates filter value', () => {
      const { store, actions } = createExpenseStore(makeStorage());

      actions.setFilter('foo');

      expect(store.get().filter).toBe('foo');
    });
  });

  describe('setSort', () => {
    it('sets sort field with asc true by default', () => {
      const { store, actions } = createExpenseStore(makeStorage());

      actions.setSort('price');

      expect(store.get().sort).toEqual({ by: 'price', asc: true });
    });

    it('toggles asc when sorting by the same field', () => {
      const { store, actions } = createExpenseStore(makeStorage());

      actions.setSort('name');

      expect(store.get().sort).toEqual({ by: 'name', asc: false });
    });

    it('resets asc to true when switching field', () => {
      const { store, actions } = createExpenseStore(makeStorage());

      actions.setSort('name');
      actions.setSort('name');
      actions.setSort('price');

      expect(store.get().sort).toEqual({ by: 'price', asc: true });
    });
  });
});
