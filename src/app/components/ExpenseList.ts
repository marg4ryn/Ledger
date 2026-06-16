import { h } from '@framework/vdom.js';
import { actions } from '@app/main.js';
import { ExpenseItem } from '@app/components/ExpenseItem.js';
import { ExpenseStore, Expense } from '@app/types.js';
import { VElement } from '@framework/types.js';

export function handleNameSort(): void {
  actions.setSort('name');
}

export function handlePriceSort(): void {
  actions.setSort('price');
}

export function handleFilter(e: InputEvent): void {
  const input = e.currentTarget as HTMLInputElement;
  actions.setFilter(input.value.trim().toLowerCase());
}

export function handleRemove(e: MouseEvent): void {
  const target = e.target as HTMLElement;
  const li = target.closest('li') as HTMLElement | null;
  if (!li) return;
  actions.removeExpense(li.dataset.id!);
}

export function getVisibleExpenses(state: ExpenseStore): Expense[] {
  return [...state.expenses]
    .filter((e) => e.name.toLowerCase().includes(state.filter))
    .sort((a, b) => {
      const { by, asc } = state.sort;
      return by === 'name'
        ? (asc ? 1 : -1) * a.name.localeCompare(b.name)
        : (asc ? 1 : -1) * (a.price - b.price);
    });
}

export function ExpenseList(state: ExpenseStore): VElement {
  const visible = getVisibleExpenses(state);

  return h(
    'section',
    { class: 'left' },
    h(
      'div',
      { class: 'btnContainer' },
      h(
        'button',
        {
          type: 'button',
          title: 'Sort items by name',
          id: 'sortByNameBtn',
          class: 'button',
          onclick: handleNameSort,
        },
        'Sort by Name',
      ),
      h(
        'div',
        { class: 'filterContainer', title: 'Filter items' },
        h('label', { for: 'filter' }, 'Filter'),
        h('input', {
          type: 'text',
          id: 'filter',
          autocomplete: 'off',
          oninput: handleFilter,
        }),
      ),
      h(
        'button',
        {
          type: 'button',
          title: 'Sort items by price',
          id: 'sortByPriceBtn',
          class: 'button',
          onclick: handlePriceSort,
        },
        'Sort by Price',
      ),
    ),
    visible.length !== 0
      ? h(
          'ul',
          { id: 'expenseList', onclick: handleRemove },
          ...visible.map(ExpenseItem),
        )
      : h('p', { id: 'blankListMsg', 'aria-live': 'polite' }, 'No expenses'),
  );
}
