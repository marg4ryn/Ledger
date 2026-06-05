import { createComponent } from '@framework/component.js';
import { store } from '@app/store.js';
import { App } from '@components/App.js';
import { Component } from '@framework/types.js';

const app: Component = createComponent(store, App);
app.mount(document.getElementById('app')!);
