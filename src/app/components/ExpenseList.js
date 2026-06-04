import { h } from '../../framework/vdom.js';
import { actions } from '../store.js';
import { ExpenseItem } from './ExpenseItem.js';

function handleNameSort() {
  actions.setSort('name');
}

function handlePriceSort() {
  actions.setSort('price');
}

function handleFilter(e) {
  actions.setFilter(e.target.value.trim().toLowerCase());
}

function handleRemove(e) {
  const li = e.target.closest('li');
  if (!li) return;
  actions.removeExpense(li.dataset.id);
}

function getVisibleExpenses(state) {
  return [...state.expenses]
    .filter((e) => e.name.toLowerCase().includes(state.filter))
    .sort((a, b) => {
      const { by, asc } = state.sort;
      return by === 'name'
        ? (asc ? 1 : -1) * a.name.localeCompare(b.name)
        : (asc ? 1 : -1) * (a.price - b.price);
    });
}

export function ExpenseList(state) {
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
          id: 'sortByNameBtn',
          class: 'button',
          onclick: handleNameSort,
        },
        'Sort by Name',
      ),
      h(
        'div',
        { class: 'filterContainer' },
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
