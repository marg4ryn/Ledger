import { store, actions } from './store.js';

const elements = {
  form: document.querySelector('form'),
  list: document.querySelector('ul'),
  filter: document.getElementById('filter'),
  sortByNameBtn: document.getElementById('sortByNameBtn'),
  sortByPriceBtn: document.getElementById('sortByPriceBtn'),
  blankMsg: document.getElementById('blankListMsg'),
  nameInput: document.getElementById('fname'),
  priceInput: document.getElementById('fprice'),
};

// ── Render ──

function getVisibleExpenses(state) {
  return [...state.expenses]
    .filter((e) => e.name.toLowerCase().includes(state.filter))
    .sort((a, b) => {
      const { by, asc } = state.sort;
      return by === 'name'
        ? (asc ? 1 : -1) * a.name.localeCompare(b.name)
        : (asc ? 1 : -1) * (a.price - b.price);
    });
}

function createExpenseElement({ id, name, price }) {
  const li = document.createElement('li');
  li.dataset.id = id;

  const nameSpan = document.createElement('span');
  nameSpan.textContent = name;

  const priceSpan = document.createElement('span');
  priceSpan.textContent = Number(price).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  li.appendChild(nameSpan);
  li.appendChild(priceSpan);
  return li;
}

function render(state) {
  const visible = getVisibleExpenses(state);

  elements.list.innerHTML = '';
  elements.blankMsg.style.display = visible.length > 0 ? 'none' : 'block';
  visible.forEach((e) => elements.list.appendChild(createExpenseElement(e)));
}

// ── Events ──

elements.filter.addEventListener('input', (e) => {
  actions.setFilter(e.target.value.trim().toLowerCase());
});

elements.sortByNameBtn.addEventListener('click', () => {
  actions.setSort('name');
});

elements.sortByPriceBtn.addEventListener('click', () => {
  actions.setSort('price');
});

elements.form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = elements.nameInput.value.trim();
  const price = Number(elements.priceInput.value);
  if (!name || price <= 0) return;
  actions.addExpense(name, price);
  elements.form.reset();
});

elements.list.addEventListener('click', (e) => {
  const li = e.target.closest('li');
  if (!li) return;
  actions.removeExpense(li.dataset.id);
});

// ── Init ──

store.subscribe(render);
render(store.get());
