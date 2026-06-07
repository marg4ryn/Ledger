import { vi, describe, it, expect, beforeEach } from 'vitest';
import {
  h,
  createElement,
  changed,
  patch,
  patchProps,
} from '../../src/framework/vdom';

describe('h', () => {
  it('creates a VElement with proper type', () => {
    const vnode = h('div', null);

    expect(vnode.type).toBe('div');
  });

  it('creates a VElement with proper props', () => {
    const vnode = h('div', { class: 'test' });

    expect(vnode.props).toStrictEqual({ class: 'test' });
  });

  it('creates a VElement without props', () => {
    const vnode = h('div', null);

    expect(vnode.props).toStrictEqual({});
  });

  it('creates a VElement without children', () => {
    const vnode = h('div', null);

    expect(vnode.children).toStrictEqual([]);
  });

  it('creates a VElement with multiple children', () => {
    const vnode = h('div', null, h('p', null), h('span', null));

    expect(vnode.children).toHaveLength(2);
    expect(vnode.children[0].type).toBe('p');
    expect(vnode.children[1].type).toBe('span');
  });

  it('flattens nested children arrays', () => {
    const children = [h('p', null), h('span', null)];
    const vnode = h('div', null, ...children);

    expect(vnode.children).toHaveLength(2);
    expect(vnode.children[0].type).toBe('p');
  });
});

describe('createElement', () => {
  it('creates a Text element', () => {
    const el = createElement('test');

    expect(el.textContent).toBe('test');
  });

  it('creates a Text element from a number', () => {
    const el = createElement(42);

    expect(el.textContent).toBe('42');
  });

  it('creates a HTMLElement with proper props', () => {
    const vnode = h('p', { class: 'test' });

    const el = createElement(vnode) as HTMLElement;

    expect(el.getAttribute('class')).toBe('test');
  });

  it('attaches event listeners', () => {
    const handleClick = vi.fn();
    const vnode = h('p', { onclick: handleClick });

    const el = createElement(vnode) as HTMLElement;
    el.click();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('recursively creates and attaches HTMLElements', () => {
    const vnode = h('div', null, h('p', null));

    const el = createElement(vnode) as HTMLElement;

    expect(el.childNodes).toHaveLength(1);
    expect(el.firstElementChild?.tagName).toBe('P');
  });
});

describe('patch', () => {
  it('creates and attaches a new HTMLElement', () => {
    const newVnode = h('p', null);
    const vnode = h('div', null);
    const el = createElement(vnode) as HTMLElement;

    patch(el, newVnode, null, 0);

    expect(el.childNodes).toHaveLength(1);
    expect(el.firstElementChild?.tagName).toBe('P');
  });

  it('removes an old HTMLElement', () => {
    const oldVnode = h('p', null);
    const vnode = h('div', null, oldVnode);
    const el = createElement(vnode) as HTMLElement;

    patch(el, null, oldVnode, 0);

    expect(el.childNodes).toHaveLength(0);
  });

  it('creates a new HTMLElement and replaces an old one', () => {
    const oldVnode = h('p', null);
    const newVnode = h('span', null);
    const vnode = h('div', null, oldVnode);
    const el = createElement(vnode) as HTMLElement;

    patch(el, newVnode, oldVnode, 0);

    expect(el.childNodes).toHaveLength(1);
    expect(el.firstElementChild?.tagName).toBe('SPAN');
  });

  it('updates props', () => {
    const oldVnode = h('p', { class: 'foo' });
    const newVnode = h('p', { class: 'bar' });
    const vnode = h('div', null, oldVnode);
    const el = createElement(vnode) as HTMLElement;

    patch(el, newVnode, oldVnode, 0);

    expect(el.firstElementChild?.getAttribute('class')).toBe('bar');
  });

  it('recursively patches children', () => {
    const oldVnode = h(
      'div',
      null,
      h('p', { class: 'foo' }),
      h('p', { class: 'foo' }),
    );
    const newVnode = h(
      'div',
      null,
      h('p', { class: 'foo' }),
      h('p', { class: 'bar' }),
    );
    const el = createElement(h('div', null, oldVnode)) as HTMLElement;
    const children = () => el.firstElementChild?.children;

    patch(el, newVnode, oldVnode, 0);

    expect(children()?.[0]?.getAttribute('class')).toBe('foo');
    expect(children()?.[1]?.getAttribute('class')).toBe('bar');
  });
});

describe('changed', () => {
  let parent: HTMLElement;

  beforeEach(() => {
    parent = document.createElement('div');
  });

  it('returns true when node types differ', () => {
    const oldVnode = 'text';
    const newVnode = h('span', null);

    const res = changed(newVnode, oldVnode);

    expect(res).toBeTruthy();
  });

  it('returns true when strings differ', () => {
    const oldVnode = 'foo';
    const newVnode = 'bar';
    parent.appendChild(document.createTextNode('foo'));

    patch(parent, newVnode, oldVnode, 0);

    expect(parent.firstChild?.textContent).toBe('bar');
  });

  it('returns false when strings are equal', () => {
    const oldVnode = 'foo';
    const newVnode = 'foo';

    const res = changed(newVnode, oldVnode);

    expect(res).toBeFalsy();
  });

  it('returns true when element tags differ', () => {
    const oldVnode = h('p', null);
    const newVnode = h('span', null);

    const res = changed(newVnode, oldVnode);

    expect(res).toBeTruthy();
  });

  it('returns false when element tags are equal', () => {
    const oldVnode = h('div', null);
    const newVnode = h('div', { class: 'x' });

    const res = changed(newVnode, oldVnode);

    expect(res).toBeFalsy();
  });
});

describe('patchProps', () => {
  it('removes deprecated props', () => {
    const handleClick = vi.fn();
    const oldVnode = h('p', { class: 'foo', onclick: handleClick });
    const newVnode = h('p', null);
    const el = createElement(oldVnode) as HTMLElement;

    patchProps(el, newVnode.props, oldVnode.props);
    el.click();

    expect(el.getAttribute('class')).toBeNull();
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('adds new props', () => {
    const handleClick = vi.fn();
    const oldVnode = h('p', null);
    const newVnode = h('p', { class: 'foo', onclick: handleClick });
    const el = createElement(oldVnode) as HTMLElement;

    patchProps(el, newVnode.props, oldVnode.props);
    el.click();

    expect(el.getAttribute('class')).toBe('foo');
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
