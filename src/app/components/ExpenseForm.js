import { h } from '../../framework/vdom.js';
import { actions } from '../store.js';

function handleSubmit(e) {
  e.preventDefault();
  const name = e.target.elements.name.value.trim();
  const price = Number(e.target.elements.price.value);
  if (!name || price <= 0) return;
  actions.addExpense(name, price);
  e.target.reset();
}

export function ExpenseForm() {
  return h(
    'section',
    { class: 'right' },
    h(
      'form',
      { id: 'expenseForm', onsubmit: handleSubmit },
      h(
        'fieldset',
        null,
        h('legend', null, 'Add new Item'),
        h(
          'div',
          { class: 'field' },
          h('label', { for: 'fname' }, 'Name'),
          h('input', {
            type: 'text',
            id: 'fname',
            name: 'name',
            maxlength: '40',
            autocomplete: 'on',
            placeholder: 'Expense Name',
            required: 'required',
          }),
        ),
        h(
          'div',
          { class: 'field' },
          h('label', { for: 'fprice' }, 'Price'),
          h('input', {
            type: 'number',
            id: 'fprice',
            name: 'price',
            min: '0.01',
            max: '999999999.99',
            step: '0.01',
            placeholder: 'Expense Price',
            required: 'required',
          }),
        ),
        h('button', { type: 'submit' }, 'Add'),
      ),
    ),
  );
}
