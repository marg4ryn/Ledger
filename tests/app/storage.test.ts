import { describe, it, vi, expect, beforeEach } from 'vitest';
import { storage } from '../../src/app/storage.js';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: () => {
      store = {};
    },
  };
})();

vi.stubGlobal('localStorage', localStorageMock);

beforeEach(() => {
  localStorageMock.clear();
  vi.clearAllMocks();
});

describe('save', () => {
  it('serializes expenses to localStorage', () => {
    const expenses = [{ id: '1', name: 'Name', price: 100 }];

    storage.save(expenses);

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'expenses',
      JSON.stringify(expenses),
    );
  });
});

describe('load', () => {
  it('returns parsed expenses from localStorage', () => {
    const expenses = [{ id: '1', name: 'Name', price: 100 }];
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(expenses));

    expect(storage.load()).toEqual(expenses);
  });

  it('returns empty array when localStorage is empty', () => {
    expect(storage.load()).toEqual([]);
  });

  it('returns empty array and logs error on invalid JSON', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorageMock.getItem.mockReturnValueOnce('invalid json{');

    expect(storage.load()).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();
  });
});
