export type VNode = VElement | string | number;

export interface VElement {
  type: string;
  props: Record<string, unknown> | null;
  children: VNode[];
}

export type Updater<T> = (state: T) => T;
export type Listener<T> = (state: T) => void;
export type RenderFn<T> = (state: T) => VNode;

export interface Store<T> {
  get: () => T;
  set: (updater: Updater<T>) => void;
  subscribe: (fn: Listener<T>) => () => void;
}

export interface Component {
  mount: (el: HTMLElement) => void;
}
