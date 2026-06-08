import { describe, it, expect, vi } from 'vitest';
import { createStore } from '../../src/framework/store.js';

vi.mock('../../src/framework/scheduler.js', () => ({
  schedule: (fn: () => void) => fn(),
}));

describe('createStore', () => {
  it('returns initial state', () => {
    const store = createStore({ count: 0 });

    expect(store.get()).toEqual({ count: 0 });
  });

  it('updates state', () => {
    const store = createStore({ count: 0 });

    store.set((state: { count: number }) => ({
      ...state,
      count: state.count + 1,
    }));

    expect(store.get()).toEqual({ count: 1 });
  });

  it('notifies subscribers', () => {
    const store = createStore({ count: 0 });
    const listener = vi.fn();

    store.subscribe(listener);
    store.set((state: { count: number }) => ({
      ...state,
      count: 1,
    }));

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith({ count: 1 });
  });

  it('notifies all subscribers', () => {
    const store = createStore(0);
    const a = vi.fn();
    const b = vi.fn();

    store.subscribe(a);
    store.subscribe(b);
    store.set((x: number) => x + 1);

    expect(a).toHaveBeenCalledWith(1);
    expect(b).toHaveBeenCalledWith(1);
  });

  it('unsubscribes listener', () => {
    const store = createStore(0);
    const listener = vi.fn();

    const unsubscribe = store.subscribe(listener);
    unsubscribe();
    store.set((x: number) => x + 1);

    expect(listener).not.toHaveBeenCalled();
  });

  it('clones initial state', () => {
    const initial = { count: 0 };

    const store = createStore(initial);
    initial.count = 999;

    expect(store.get()).toEqual({ count: 0 });
  });
});
