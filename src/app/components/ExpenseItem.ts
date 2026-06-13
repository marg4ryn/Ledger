import { h } from '@framework/vdom.js';
import { Expense } from '@app/types.js';
import { VElement } from '@framework/types.js';

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

function formatPrice(price: number): string {
  return usdFormatter.format(price);
}

export function ExpenseItem({ id, name, price }: Expense): VElement {
  return h(
    'li',
    { 'data-id': id, title: 'Remove item' },
    h('span', null, name),
    h('span', null, formatPrice(price)),
  );
}
