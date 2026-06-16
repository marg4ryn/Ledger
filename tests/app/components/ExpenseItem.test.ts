import { describe, it, expect } from 'vitest';
import { formatPrice } from '../../../src/app/components/ExpenseItem.js';

describe('formatPrice', () => {
  it('formats positive values to USD', () => {
    expect(formatPrice(42)).toBe('$42.00');
  });

  it('formats negative values to USD', () => {
    expect(formatPrice(-1)).toBe('-$1.00');
  });

  it('formats zero', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });

  it('rounds to two decimal places', () => {
    expect(formatPrice(9.999)).toBe('$10.00');
    expect(formatPrice(1.005)).toBe('$1.01');
  });
});
