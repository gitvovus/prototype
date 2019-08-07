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

export function stopPropagation(e: Event) {
  e.stopPropagation();
}
