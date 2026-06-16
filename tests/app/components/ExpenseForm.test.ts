import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleSubmit } from '../../../src/app/components/ExpenseForm.js';
import { actions } from '../../../src/app/main.js';

vi.mock('../../../src/app/main.js', () => ({
  actions: {
    addExpense: vi.fn(),
  },
}));

function createForm(name: string, price: string) {
  const form = document.createElement('form');

  const nameInput = document.createElement('input');
  nameInput.name = 'name';
  nameInput.value = name;

  const priceInput = document.createElement('input');
  priceInput.name = 'price';
  priceInput.value = price;

  form.append(nameInput, priceInput);

  return { form, nameInput, priceInput };
}

describe('handleSubmit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('adds expense and resets form for valid input', () => {
    const { form, nameInput, priceInput } = createForm('foo', '42');
    const event = {
      preventDefault: vi.fn(),
      currentTarget: form,
    } as unknown as SubmitEvent;

    handleSubmit(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(actions.addExpense).toHaveBeenCalledWith('foo', 42);
    expect(nameInput.value).toBe('');
    expect(priceInput.value).toBe('');
  });

  it('does not add expense when name is empty', () => {
    const { form, nameInput, priceInput } = createForm('', '42');
    const event = {
      preventDefault: vi.fn(),
      currentTarget: form,
    } as unknown as SubmitEvent;

    handleSubmit(event);

    expect(actions.addExpense).not.toHaveBeenCalled();
    expect(nameInput.value).toBe('');
    expect(priceInput.value).toBe('42');
  });

  it('does not add expense when price is zero', () => {
    const { form, nameInput, priceInput } = createForm('foo', '0');
    const event = {
      preventDefault: vi.fn(),
      currentTarget: form,
    } as unknown as SubmitEvent;

    handleSubmit(event);

    expect(actions.addExpense).not.toHaveBeenCalled();
    expect(nameInput.value).toBe('foo');
    expect(priceInput.value).toBe('0');
  });

  it('does not add expense when price is negative', () => {
    const { form, nameInput, priceInput } = createForm('foo', '-1');
    const event = {
      preventDefault: vi.fn(),
      currentTarget: form,
    } as unknown as SubmitEvent;

    handleSubmit(event);

    expect(actions.addExpense).not.toHaveBeenCalled();
    expect(nameInput.value).toBe('foo');
    expect(priceInput.value).toBe('-1');
  });
});
