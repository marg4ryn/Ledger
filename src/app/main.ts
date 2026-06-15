import { createComponent } from '@framework/component.js';
import { createExpenseStore } from '@app/store.js';
import { App } from '@components/App.js';
import { Component } from '@framework/types.js';

export const { store, actions } = createExpenseStore();

const app: Component = createComponent(store, App);
app.mount(document.getElementById('app')!);
