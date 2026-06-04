import { createElement, patch } from '@framework/vdom.js';

export function createComponent(store, render) {
  let oldVnode = null;
  let container = null;

  function update(state) {
    const newVnode = render(state);

    if (!oldVnode) {
      // first render - create DOM from vDOM
      container.appendChild(createElement(newVnode));
    } else {
      // subsequent renders - diffing
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
