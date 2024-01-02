import { ObservableMembrane } from "observable-membrane";
import { GL_GLOBAL_STORE } from "../namings";

const GL_GLOBAL_STORE_DEBOUNCE_TIME = 10; // in ms

export function createGlobalStore(defaultValue) {
  if (typeof defaultValue !== "object" || defaultValue === null)
    throw new Error("You must provide an object for a store default value.");

  const onChangeCallbacks = [];

  const dataStore = defaultValue ?? {};
  const mutationProxy = new ObservableMembrane({
    valueMutated(_, key) {
      onChangeCallbacks.forEach((callback) => {
        callback(key);
      });
    },
  });

  const proxiedDataStore = mutationProxy.getProxy(dataStore);

  function get() {
    return proxiedDataStore;
  }

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
    onChange,
    effect,
    attachedTo: GL_GLOBAL_STORE,
  };

  return newStore;
}
