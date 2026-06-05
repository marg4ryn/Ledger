import { VElement } from '@framework/types.js';
import { h } from '@framework/vdom.js';

export function ExpenseHeader(): VElement {
  return h('header', null, h('h1', null, 'List of Expenses'));
}
