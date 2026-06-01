const callbacks = new Map();
let pending = false;

export function schedule(listener, state) {
  callbacks.set(listener, state);

  if (pending) return;
  pending = true;

  requestAnimationFrame(() => {
    callbacks.forEach((state, listener) => {
      listener(state);
    });

    callbacks.clear();
    pending = false;
  });
}
