import { createElement, patch } from '@framework/vdom.js';
import type { Store, VNode, RenderFn, Component } from '@framework/types.js';

export function createComponent<T>(
  store: Store<T>,
  render: RenderFn<T>,
): Component {
  let oldVnode: VNode | null = null;
  let container: HTMLElement | null = null;

  function update(state: T): void {
    const newVnode = render(state);

    if (!oldVnode) {
      // first render - create DOM from vDOM
      container!.appendChild(createElement(newVnode));
    } else {
      // subsequent renders - diffing
      patch(container!, newVnode, oldVnode, 0);
    }

    oldVnode = newVnode;
  }

  return {
    mount(el) {
      container = el;
      update(store.get());
      store.subscribe(update);
    },
  };
}
