import { GL_GLOBAL_STORE } from "../namings";
import { GL_STORE_UPDATED_EVENT } from "../namings";
import { getObjectScopedProperty, setObjectScopedProperty } from "../evaluator";
import { iterateOverControllers } from "../controller/register";

const GL_GLOBAL_STORE_DEBOUNCE_TIME = 10; // in ms

export function createGlobalStore(defaultValue) {
  if (typeof defaultValue !== "object" || defaultValue === null)
    throw new Error("You must provide an object for a store default value.");

  const dataStore = defaultValue ?? {};

  function get(property) {
    if (!property) return dataStore;

    return getObjectScopedProperty(dataStore, property);
  }

  function set(property, value) {
    setObjectScopedProperty(dataStore, property, value);

    // Side effect for reactivity
    iterateOverControllers((Controller) => {
      Controller.callEvent(GL_STORE_UPDATED_EVENT, property);
    });
  }

  // These are used internally to handle onChange events.
  const onChangeCallbacks = [];
  function onChange(callback) {
    if (typeof callback !== "function")
      throw new Error(
        "The onChange callback provided for the global store is not a function."
      );

    onChangeCallbacks.push(callback);
  }

  function effect(callback, depsArray) {
    if (typeof callback !== "function")
      throw new Error(
        "The onChange callback provided for the global store is not a function."
      );

    // We create a function with debounced calling of the callback.
    let updatedTimes = 0;
    function onEffectHappens(keyUpdated) {
      if (!depsArray.includes(keyUpdated)) return;

      updatedTimes++;
      const localTimes = updatedTimes;

      setTimeout(() => {
        if (localTimes !== updatedTimes) return;

        updatedTimes = 0;
        callback();
      }, GL_GLOBAL_STORE_DEBOUNCE_TIME);
    }

    // We add a listener for any change, but we implement the check for dependencies array.
    onChange(onEffectHappens);
  }

  const newStore = {
    get,
    set,
    effect,
    attachedTo: GL_GLOBAL_STORE,
  };

  return newStore;
}
