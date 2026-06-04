import { h } from '@framework/vdom.js';

export function ExpenseHeader() {
  return h('header', null, h('h1', null, 'List of Expenses'));
}
