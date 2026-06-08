import { h } from '@framework/vdom.js';
import { Expense } from '@app/types.js';
import { VElement } from '@framework/types.js';

function formatPrice(price: number): string {
  return Number(price).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
}

export function ExpenseItem({ id, name, price }: Expense): VElement {
  return h(
    'li',
    { 'data-id': id, title: 'Remove item' },
    h('span', null, name),
    h('span', null, formatPrice(price)),
  );
}
