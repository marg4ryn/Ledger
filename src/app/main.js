import { createComponent } from '@framework/component.js';
import { store } from '@app/store.js';
import { App } from '@app/App.js';

const app = createComponent(store, App);
app.mount(document.getElementById('app'));
