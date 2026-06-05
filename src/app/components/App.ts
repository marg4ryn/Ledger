import { h } from '@framework/vdom.js';
import { ExpenseForm } from '@components/ExpenseForm.js';
import { ExpenseList } from '@components/ExpenseList.js';
import { ExpenseHeader } from '@components/ExpenseHeader.js';
import { VElement } from '@framework/types.js';
import { ExpenseStore } from '@app/types';

export function App(state: ExpenseStore): VElement {
  return h(
    'div',
    null,
    ExpenseHeader(),
    h('main', null, ExpenseList(state), ExpenseForm()),
  );
}
