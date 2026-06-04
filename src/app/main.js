import { createComponent } from '../framework/component.js';
import { store } from './store.js';
import { App } from './App.js';

const app = createComponent(store, App);
app.mount(document.getElementById('app'));
