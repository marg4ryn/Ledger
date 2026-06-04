export function h(type, props, ...children) {
  return {
    type,
    props: props || {},
    children: children.flat(),
  };
}

export function createElement(vnode) {
  if (vnode == null) {
    return document.createTextNode('');
  }

  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return document.createTextNode(vnode);
  }

  const el = document.createElement(vnode.type);

  Object.entries(vnode.props).forEach(([key, value]) => {
    if (key.startsWith('on')) {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      el.setAttribute(key, value);
    }
  });

  vnode.children.forEach((child) => {
    el.appendChild(createElement(child));
  });

  return el;
}

export function patch(parent, newVnode, oldVnode, index = 0) {
  const currentEl = parent.childNodes[index];

  if (!oldVnode) {
    parent.appendChild(createElement(newVnode));
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

  patchProps(currentEl, newVnode.props, oldVnode.props);

  const newLength = newVnode.children?.length ?? 0;
  const oldLength = oldVnode.children?.length ?? 0;
  const max = Math.max(newLength, oldLength);

  for (let i = max - 1; i >= 0; i--) {
    patch(currentEl, newVnode.children[i], oldVnode.children[i], i);
  }
}

function changed(newVnode, oldVnode) {
  // different Node Type
  if (typeof newVnode !== typeof oldVnode) return true;
  // different String
  if (typeof newVnode === 'string') return newVnode !== oldVnode;
  // different Node Tag
  if (newVnode.type !== oldVnode.type) return true;
  return false;
}

function patchProps(el, newProps = {}, oldProps = {}) {
  // remove deprecated attributes
  Object.keys(oldProps).forEach((key) => {
    if (!(key in newProps)) {
      if (key.startsWith('on')) {
        el.removeEventListener(key.slice(2).toLowerCase(), oldProps[key]);
      } else {
        el.removeAttribute(key);
      }
    }
  });

  // add new attributes
  Object.entries(newProps).forEach(([key, value]) => {
    if (oldProps[key] === value) return;
    if (key.startsWith('on')) {
      el.removeEventListener(key.slice(2).toLowerCase(), oldProps[key]);
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      el.setAttribute(key, value);
    }
  });
}
