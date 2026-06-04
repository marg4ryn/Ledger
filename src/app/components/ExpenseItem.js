import { h } from '@framework/vdom.js';
import { actions } from '@app/store.js';

function formatPrice(price) {
  return Number(price).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
}

export function ExpenseItem({ id, name, price }) {
  return h(
    'li',
    { 'data-id': id },
    h('span', null, name),
    h('span', null, formatPrice(price)),
  );
}
