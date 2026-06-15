import { h } from '@framework/vdom.js';
import { actions } from '@app/main.js';
import { VElement } from '@framework/types.js';

export function handleSubmit(e: SubmitEvent): void {
  e.preventDefault();

  const form = e.currentTarget as HTMLFormElement;
  const nameInput = form.elements.namedItem('name') as HTMLInputElement;
  const priceInput = form.elements.namedItem('price') as HTMLInputElement;

  const name = nameInput.value.trim();
  const price = Number(priceInput.value);

  if (!name || price <= 0) return;

  actions.addExpense(name, price);

  form.reset();
}

export function ExpenseForm(): VElement {
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
        h('button', { type: 'submit', title: 'Add item' }, 'Add'),
      ),
    ),
  );
}
