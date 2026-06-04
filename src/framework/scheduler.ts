const callbacks = new Set<() => void>();
let pending: boolean = false;

export function schedule(fn: () => void): void {
  callbacks.add(fn);

  if (pending) return;
  pending = true;

  requestAnimationFrame(() => {
    callbacks.forEach((fn) => fn());
    callbacks.clear();
    pending = false;
  });
}
