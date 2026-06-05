import type { VNode, VElement } from '@framework/types.js';

export function h(
  type: string,
  props?: Record<string, unknown>,
  ...children: VNode[]
): VElement {
  return {
    type,
    props: props || {},
    children: children.flat() as VNode[],
  };
}

export function createElement(vnode: VNode): HTMLElement | Text {
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return document.createTextNode(String(vnode));
  }

  const el = document.createElement(vnode.type);

  Object.entries(vnode.props).forEach(([key, value]) => {
    if (key.startsWith('on')) {
      el.addEventListener(key.slice(2).toLowerCase(), value as EventListener);
    } else {
      el.setAttribute(key, value as string);
    }
  });

  vnode.children.forEach((child) => {
    el.appendChild(createElement(child));
  });

  return el;
}

export function patch(
  parent: HTMLElement,
  newVnode?: VNode,
  oldVnode?: VNode,
  index: number = 0,
): void {
  const currentEl = parent.childNodes[index] as HTMLElement;

  if (!oldVnode) {
    if (newVnode !== undefined) {
      parent.appendChild(createElement(newVnode));
    }
    return;
  }

  if (!newVnode) {
    parent.removeChild(currentEl);
    return;
  }

  if (changed(newVnode, oldVnode)) {
    parent.replaceChild(createElement(newVnode), currentEl);
    return;
  }

  if (isVElement(newVnode) && isVElement(oldVnode)) {
    patchProps(currentEl, newVnode.props, oldVnode.props);

    const newLength = newVnode.children?.length ?? 0;
    const oldLength = oldVnode.children?.length ?? 0;
    const max = Math.max(newLength, oldLength);

    for (let i = max - 1; i >= 0; i--) {
      patch(currentEl, newVnode.children[i], oldVnode.children[i], i);
    }
  }
}

function isVElement(vnode: VNode): vnode is VElement {
  return typeof vnode === 'object';
}

function changed(newVnode: VNode, oldVnode: VNode): boolean {
  // different Node Type
  if (typeof newVnode !== typeof oldVnode) return true;
  // different String
  if (typeof newVnode === 'string') return newVnode !== oldVnode;
  // different Node Tag
  if (isVElement(newVnode) && isVElement(oldVnode)) {
    if (newVnode.type !== oldVnode.type) return true;
  }
  return false;
}

function patchProps(
  el: HTMLElement,
  newProps: Record<string, unknown> = {},
  oldProps: Record<string, unknown> = {},
): void {
  // remove deprecated attributes
  Object.keys(oldProps).forEach((key) => {
    if (!(key in newProps)) {
      if (key.startsWith('on')) {
        el.removeEventListener(
          key.slice(2).toLowerCase(),
          oldProps[key] as EventListener,
        );
      } else {
        el.removeAttribute(key);
      }
    }
  });

  // add new attributes
  Object.entries(newProps).forEach(([key, value]) => {
    if (oldProps[key] === value) return;
    if (key.startsWith('on')) {
      el.removeEventListener(
        key.slice(2).toLowerCase(),
        oldProps[key] as EventListener,
      );
      el.addEventListener(key.slice(2).toLowerCase(), value as EventListener);
    } else {
      el.setAttribute(key, value as string);
    }
  });
}
