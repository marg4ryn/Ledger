import { createElement, patch } from './vdom.js';

export function createComponent(store, render) {
  let oldVnode = null;
  let container = null;

  function update(store) {
    const newVnode = render(state);

    if (!oldVnode) {
      container.appendChild(createElement(newVnode));
    } else {
      patch(container, newVnode, oldVnode, 0);
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
