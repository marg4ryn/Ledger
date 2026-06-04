## To Do

- rewrite to TypeScript
- tests
- improve responsiveness

# Ledger

A simple reactive UI framework written in vanilla JavaScript. An educational project demonstrating how modern reactive frameworks work.

## Architecture

```
src/
  framework/
    store.js       ← reactive state
    vdom.js        ← virtual DOM
    scheduler.js   ← renders batching
    component.js   ← component abstraction
  app/
    components/
      App.js
      ExpenseList.js
      ExpenseForm.js
      ExpenseItem.js
      ExpenseHeader.js
    styles/
      style.css
    store.js       ← application state and actions
    storage.js     ← persistence in localStorage
    main.js        ← entry point
index.html
```

---

## Framework modules

### store.js

Reactive closure-based state. Any change via `set` automatically notifies subscribers.

```javascript
import { createStore } from '@framework/store.js';

const store = createStore({ count: 0 });

store.subscribe((state) => console.log(state.count));

store.set((state) => ({ ...state, count: state.count + 1 }));
// → 1
```

API:

- `get()` — returns the current state
- `set(updater)` — accepts the `state => newState` function, updates the state, and notifies subscribers
- `subscribe(fn)` — registers a listener, returns a function for unsubscribing

### vdom.js

Virtual DOM - describes the UI as plain JS objects, only updates changed nodes.

```javascript
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

### scheduler.js

Collects state changes and renders once per frame via `requestAnimationFrame`. Prevents multiple renderings on multiple state changes in the same frame.

```javascript
import { schedule } from '@framework/scheduler.js';

schedule(() => render(store.get()));
```

### component.js

Combines the store with the vDOM. Creates the DOM on the first render, and diffs on subsequent renders.

```javascript
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

```javascript
function MyComponent(state) {
  return h('div', { class: 'container' }, h('p', null, state.message));
}
```

Events are passed through props with the prefix `on`:

```javascript
function handleClick() {
  actions.doSomething();
}

h('button', { onclick: handleClick }, 'Kliknij');
```

---

## Launch

No dependencies or bundler required.

```bash
# e.g., via Live Server in VS Code
# or
npx serve .
```

---

## Limitations

- No keys for diffing - sorting the list replaces nodes instead of rearranging them
- No local component state - state lives only in the store
- No fragment support - each component must return a single root node
- Events are registered on every render - no optimization
