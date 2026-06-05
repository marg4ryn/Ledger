import { schedule } from '@framework/scheduler.js';
import type { Listener, Store } from '@framework/types.js';

export function createStore<T>(initial: T): Store<T> {
  let state = structuredClone(initial);
  const listeners = new Set<Listener<T>>();

  return {
    get() {
      return state;
    },
    set(updater) {
      state = updater(state);
      listeners.forEach((fn) => schedule(() => fn(state)));
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn); // unsubscribe
    },
  };
}
