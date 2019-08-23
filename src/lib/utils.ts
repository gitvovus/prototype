/**
 * HTMLElement addEventListener wrapper.
 * @param type event type.
 * @param handler event handler.
 * @param options event options.
 * @returns function that will remove this listener when called.
 */
export function addElementEventListener<K extends keyof HTMLElementEventMap>(el: HTMLElement, type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions) {
  el.addEventListener(type, listener, options);
  return () => el.removeEventListener(type, listener, options);
}

/**
 * HTMLElement addEventListener wrapper.
 * @param type event type.
 * @param handler event handler.
 * @param options event options.
 * @returns function that will remove this listener when called.
 */
export function addWindowEventListener<K extends keyof WindowEventMap>(type: K, listener: (this: Window, ev: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions) {
  window.addEventListener(type, listener, options);
  return () => window.removeEventListener(type, listener, options);
}

/**
 * Allows to use event offset coordinates relative to event current target.
 * Note: e.offsetX and e.offsetY works differently in Firefox (relative to e.target) and Chrome (relative to e.currentTarget).
 * @param e event.
 * @returns event coordinates offset relative to event's currentTarget.
 */
export function currentTargetOffset(e: MouseEvent) {
  const rect = (e.currentTarget as Element).getBoundingClientRect();
  return [e.clientX - rect.left, e.clientY - rect.top];
}

export function preventDefault(e: Event) {
  e.preventDefault();
}

export function stopPropagation(e: Event) {
  e.stopPropagation();
}
