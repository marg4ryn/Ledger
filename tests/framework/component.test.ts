import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createComponent } from '../../src/framework/component.js';
import { patch } from '../../src/framework/vdom.js';
import type { Store, VNode } from '../../src/framework/types.js';

vi.mock('../../src/framework/vdom.js', () => ({
  patch: vi.fn(),
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
const mockPatch = vi.mocked(patch);

describe('createComponent', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    mockPatch.mockClear();
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

  it('calls patch on initial mount with null oldVnode', () => {
    const store = makeStore(0);
    const render = vi.fn().mockReturnValue(simpleVNode);
    createComponent(store, render).mount(container);

    expect(mockPatch).toHaveBeenCalledOnce();
    expect(mockPatch).toHaveBeenCalledWith(container, simpleVNode, null, 0);
  });

  it('calls patch on state update with previous vnode as oldVnode', () => {
    const store = makeStore(0);
    const firstVNode: VNode = {
      type: 'div',
      props: { id: 'first' },
      children: [],
    };
    const secondVNode: VNode = {
      type: 'div',
      props: { id: 'second' },
      children: [],
    };
    const render = vi
      .fn()
      .mockReturnValueOnce(firstVNode)
      .mockReturnValueOnce(secondVNode);

    createComponent(store, render).mount(container);
    store.set((x) => x + 1);

    expect(mockPatch).toHaveBeenCalledTimes(2);
    expect(mockPatch).toHaveBeenNthCalledWith(
      1,
      container,
      firstVNode,
      null,
      0,
    );
    expect(mockPatch).toHaveBeenNthCalledWith(
      2,
      container,
      secondVNode,
      firstVNode,
      0,
    );
  });

  it('passes container element to every patch call', () => {
    const store = makeStore(0);
    createComponent(store, () => simpleVNode).mount(container);
    store.set((x) => x + 1);

    mockPatch.mock.calls.forEach((call) => {
      expect(call[0]).toBe(container);
    });
  });
});
