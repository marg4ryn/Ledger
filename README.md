# Ledger

A simple reactive UI framework written in vanilla TypeScript. An educational project demonstrating how modern reactive frameworks work.

## Architecture

```
src/
  framework/
    store.ts       ← reactive state
    vdom.ts        ← virtual DOM
    scheduler.ts   ← renders batching
    component.ts   ← component abstraction
    types.ts       ← TypeScript types
  app/
    components/
      App.ts
      ExpenseList.ts
      ExpenseForm.ts
      ExpenseItem.ts
      ExpenseHeader.ts
    styles/
      style.css
    store.ts       ← application state and actions
    storage.ts     ← persistence in localStorage
    types.ts       ← TypeScript types
    main.ts        ← entry point
index.html
```

---

## Framework modules

### store.ts

Reactive closure-based state. Any change via `set` automatically notifies subscribers.

```typescript
import { createStore } from '@framework/store.js';

type CounterStore = { count: number };

const store = createStore<CounterStore>({ count: 0 });

store.subscribe((state) => console.log(state.count));

store.set((state) => ({ ...state, count: state.count + 1 }));
// → 1
```

API:

- `get()` — returns the current state
- `set(updater)` — accepts the `state => newState` function, updates the state, and notifies subscribers
- `subscribe(fn)` — registers a listener, returns a function for unsubscribing

### vdom.ts

Virtual DOM - describes the UI as plain TS objects, only updates changed nodes.

```typescript
import { h, createElement, patch } from '@framework/vdom.js';

// creating a vDOM node
const vnode = h(
  'ul',
  { class: 'list' },
  h('li', { 'data-id': '1' }, 'coffee'),
  h('li', { 'data-id': '2' }, 'tea'),
);

// vDOM → real DOM
const el = createElement(vnode);

// diffing and updating
patch(container, newVnode, oldVnode, 0);
```

API:

- `h(type, props, ...children)` — creates a vDOM node
- `createElement(vnode)` — converts a vDOM to a DOM node
- `patch(parent, newVnode, oldVnode, index)` — compares and updates the DOM

### scheduler.ts

Collects state changes and renders once per frame via `requestAnimationFrame`. Prevents multiple renderings on multiple state changes in the same frame.

```typescript
import { schedule } from '@framework/scheduler.js';

schedule(() => render(store.get()));
```

### component.ts

Combines the store with the vDOM. Creates the DOM on the first render, and diffs on subsequent renders.

```typescript
import { createComponent } from '@framework/component.js';

const app = createComponent(store, AppComponent);
app.mount(document.getElementById('app'));
```

API:

- `createComponent(store, renderFn)` — takes a store and a `state => vnode` function
- `mount(el)` — attaches the component to a DOM element and subscribes to the store

---

## Application Components

A component is a function that accepts state and returns a vDOM:

```typescript
function MyComponent(state) {
  return h('div', { class: 'container' }, h('p', null, state.message));
}
```

Events are passed through props with the prefix `on`:

```typescript
function handleClick() {
  actions.doSomething();
}

h('button', { onclick: handleClick }, 'Click me!');
```

---

## Launch

Install TypeScript:

```bash
npm install typescript --save-dev
```

Run TypeScript in watch mode:

```bash
npm run watch
```

Open the application using Live Server in VS Code (or any static server) to serve `index.html`. The browser loads compiled files from `/dist`, which are continuously updated by the TypeScript watcher.

---

## Limitations

- No keys for diffing - sorting the list replaces nodes instead of rearranging them
- No local component state - state lives only in the store
- No fragment support - each component must return a single root node
- Events are registered on every render - no optimization
