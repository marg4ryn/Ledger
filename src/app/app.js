import { h } from '@framework/vdom.js';
import { ExpenseForm } from '@components/ExpenseForm.js';
import { ExpenseList } from '@components/ExpenseList.js';
import { ExpenseHeader } from '@components/ExpenseHeader.js';

export function App(state) {
  return h(
    'div',
    null,
    ExpenseHeader(),
    h('main', null, ExpenseList(state), ExpenseForm()),
  );
}
