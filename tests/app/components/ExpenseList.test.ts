import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  handleNameSort,
  handlePriceSort,
  handleFilter,
  handleRemove,
  getVisibleExpenses,
} from '../../../src/app/components/ExpenseList.js';
import { actions } from '../../../src/app/main.js';

vi.mock('../../../src/app/main.js', () => ({
  actions: {
    setSort: vi.fn(),
    setFilter: vi.fn(),
    removeExpense: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('handleNameSort', () => {
  it('sets sort method to name', () => {
    handleNameSort();
    expect(actions.setSort).toHaveBeenCalledWith('name');
  });
});

describe('handlePriceSort', () => {
  it('sets sort method to price', () => {
    handlePriceSort();
    expect(actions.setSort).toHaveBeenCalledWith('price');
  });
});

describe('handleFilter', () => {
  it('trims and lowercases input value', () => {
    const input = document.createElement('input');
    input.value = ' FOO ';
    const event = {
      currentTarget: input,
    } as unknown as InputEvent;

    handleFilter(event);

    expect(actions.setFilter).toHaveBeenCalledWith('foo');
  });
});

describe('handleRemove', () => {
  it('removes expense by id', () => {
    const li = document.createElement('li');
    li.dataset.id = '123';
    const event = {
      target: li,
    } as unknown as MouseEvent;

    handleRemove(event);

    expect(actions.removeExpense).toHaveBeenCalledWith('123');
  });

  it('does nothing when li is not found', () => {
    const ul = document.createElement('ul');

    const event = {
      target: ul,
    } as unknown as MouseEvent;

    handleRemove(event);

    expect(actions.removeExpense).not.toHaveBeenCalled();
  });
});

describe('getVisibleExpenses', () => {
  const expenses = [
    { id: '1', name: 'Coffee', price: 10 },
    { id: '2', name: 'Apple', price: 20 },
    { id: '3', name: 'Tea', price: 5 },
  ];

  it('filters expenses by name', () => {
    const state = {
      expenses,
      filter: 'cof',
      sort: {
        by: 'name',
        asc: true,
      },
    };

    expect(getVisibleExpenses(state)).toEqual([
      { id: '1', name: 'Coffee', price: 10 },
    ]);
  });

  it('sorts by name ascending', () => {
    const state = {
      expenses,
      filter: '',
      sort: {
        by: 'name',
        asc: true,
      },
    };

    expect(getVisibleExpenses(state).map((e) => e.name)).toEqual([
      'Apple',
      'Coffee',
      'Tea',
    ]);
  });

  it('sorts by name descending', () => {
    const state = {
      expenses,
      filter: '',
      sort: {
        by: 'name',
        asc: false,
      },
    };

    expect(getVisibleExpenses(state).map((e) => e.name)).toEqual([
      'Tea',
      'Coffee',
      'Apple',
    ]);
  });

  it('sorts by price ascending', () => {
    const state = {
      expenses,
      filter: '',
      sort: {
        by: 'price',
        asc: true,
      },
    };

    expect(getVisibleExpenses(state).map((e) => e.price)).toEqual([5, 10, 20]);
  });

  it('sorts by price descending', () => {
    const state = {
      expenses,
      filter: '',
      sort: {
        by: 'price',
        asc: false,
      },
    };

    expect(getVisibleExpenses(state).map((e) => e.price)).toEqual([20, 10, 5]);
  });
});
