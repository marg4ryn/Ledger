import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createComponent } from '../../src/framework/component.js';
import type { Store, VNode } from '../../src/framework/types.js';

vi.mock('../../src/framework/vdom.js', () => ({
  createElement: (vnode: VNode) => {
    const el = document.createElement('div');
    el.textContent = String(
      typeof vnode === 'object' && 'type' in vnode ? vnode.type : vnode,
    );
    return el;
  },
  patch: vi.fn(),
}));

vi.mock('../../src/framework/scheduler.js', () => ({
  schedule: (fn: () => void) => fn(),
}));

function makeStore<T>(initial: T): Store<T> {
  let state = initial;
  const listeners = new Set<(s: T) => void>();
  return {
    get: () => state,
    set: (updater) => {
      state = updater(state);
      listeners.forEach((fn) => fn(state));
    },
    subscribe: (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}

const simpleVNode: VNode = { type: 'div', props: {}, children: [] };

describe('createComponent', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
  });

  it('mounts and renders initial state', () => {
    const store = makeStore(0);
    const render = vi.fn().mockReturnValue(simpleVNode);
    const component = createComponent(store, render);

    component.mount(container);

    expect(render).toHaveBeenCalledWith(0);
  });

  it('re-renders on state change', () => {
    const store = makeStore(0);
    const render = vi.fn().mockReturnValue(simpleVNode);
    const component = createComponent(store, render);

    component.mount(container);
    store.set((x) => x + 1);

    expect(render).toHaveBeenCalledTimes(2);
    expect(render).toHaveBeenLastCalledWith(1);
  });

  it('subscribes to store on mount', () => {
    const store = makeStore(0);
    const subscribeSpy = vi.spyOn(store, 'subscribe');
    const component = createComponent(store, () => simpleVNode);

    component.mount(container);

    expect(subscribeSpy).toHaveBeenCalledTimes(1);
  });

  it('calls render with updated state', () => {
    const store = makeStore({ count: 0 });
    const render = vi.fn().mockReturnValue(simpleVNode);
    const component = createComponent(store, render);

    component.mount(container);
    store.set((s) => ({ count: s.count + 1 }));

    expect(render).toHaveBeenLastCalledWith({ count: 1 });
  });
});
