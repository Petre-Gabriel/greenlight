import { GL_STORE_UPDATED_EVENT } from "./namings";

const GL_EFFECT_DEBOUNCE_TIME = 10; // in ms

/**
 *
 * @param {Function} callback - function to call when deps change
 * @param {Strings array} depsArray - the name of the variables that should change.
 * Example: Controller.effect(() => console.log('works'), ['username', 'password']);
 */
export function effect(callback, depsArray) {
  let callsCount = 0;

  // This will be added to each controller,  so we can access it's properties with `this`.
  this.on(GL_STORE_UPDATED_EVENT, (key) => {
    if (depsArray.length !== 0 && !depsArray.includes(key)) return;

    /**
     * We debounce the function call so it calls only when the last key updated.
     */
    callsCount++;
    const callNumber = callsCount;

    setTimeout(() => {
      if (callsCount === callNumber) callback();
    }, GL_EFFECT_DEBOUNCE_TIME);
  });
}
