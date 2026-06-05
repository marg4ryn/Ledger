export interface Expense {
  id: string;
  name: string;
  price: number;
}

export interface ExpenseStorage {
  save: (expenses: Expense[]) => void;
  load: () => Expense[];
}

export type SortBy = 'name' | 'price';

export interface Sort {
  by: SortBy;
  asc: boolean;
}

export interface ExpenseStore {
  expenses: Expense[];
  filter: string;
  sort: Sort;
}
