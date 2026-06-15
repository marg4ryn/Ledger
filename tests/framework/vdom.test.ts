import { vi, describe, it, expect } from 'vitest';
import {
  h,
  createElement,
  changed,
  patch,
  patchProps,
} from '../../src/framework/vdom';

describe('h', () => {
  it('creates a VElement with only a type', () => {
    const vnode = h('div', null);

    expect(vnode.type).toBe('div');
    expect(vnode.props).toEqual({});
    expect(vnode.children).toEqual([]);
  });

  it('creates a VElement with multiple props', () => {
    const vnode = h('div', { class: 'foo', id: 42 });
    expect(vnode.props).toEqual({ class: 'foo', id: 42 });
  });

  it('creates a VElement with multiple children', () => {
    const children = [h('p', null), h('span', null)];

    const vnode = h('div', null, ...children);

    expect(vnode.children).toHaveLength(2);
    expect(vnode.children[0].type).toBe('p');
    expect(vnode.children[1].type).toBe('span');
  });

  it('flattens nested children arrays', () => {
    const children = [h('p', null), h('span', null)];

    const vnode = h('div', null, children);

    expect(vnode.children).toHaveLength(2);
    expect(vnode.children[0].type).toBe('p');
    expect(vnode.children[1].type).toBe('span');
  });
});

describe('createElement', () => {
  it('creates a Text element from a string', () => {
    const el = createElement('test');
    expect(el.textContent).toBe('test');
  });

  it('creates a Text element from a number', () => {
    const el = createElement(42);
    expect(el.textContent).toBe('42');
  });

  it('creates a HTMLElement with props', () => {
    const vnode = h('p', { class: 'test' });

    const el = createElement(vnode) as HTMLElement;

    expect(el.tagName).toBe('P');
    expect(el.getAttribute('class')).toBe('test');
  });

  it('attaches event listeners', () => {
    const handleClick = vi.fn();
    const vnode = h('p', { onclick: handleClick });

    const el = createElement(vnode) as HTMLElement;
    el.click();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('creates child HTMLElements', () => {
    const children = [h('p', null), h('span', null)];
    const vnode = h('div', null, ...children);

    const el = createElement(vnode) as HTMLElement;

    expect(el.childNodes).toHaveLength(2);
    expect(el.children[0].tagName).toBe('P');
    expect(el.children[1].tagName).toBe('SPAN');
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

  it('updates children', () => {
    const oldChildren = [h('p', { class: 'foo' }), h('p', { class: 'foo' })];
    const newChildren = [h('p', { class: 'foo' }), h('p', { class: 'bar' })];
    const oldVnode = h('div', null, ...oldChildren);
    const newVnode = h('div', null, ...newChildren);
    const el = createElement(h('div', null, oldVnode)) as HTMLElement;
    const children = () => el.firstElementChild?.children;

    patch(el, newVnode, oldVnode, 0);

    expect(children()?.[0]?.getAttribute('class')).toBe('foo');
    expect(children()?.[1]?.getAttribute('class')).toBe('bar');
  });
});

describe('changed', () => {
  it('returns true when node types differ', () => {
    const oldVnode = 'text';
    const newVnode = h('span', null);

    const res = changed(newVnode, oldVnode);

    expect(res).toBeTruthy();
  });

  it('returns true when strings differ', () => {
    const oldVnode = 'foo';
    const newVnode = 'bar';

    const res = changed(newVnode, oldVnode);

    expect(res).toBeTruthy();
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
