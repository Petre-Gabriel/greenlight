import { ObservableMembrane } from "observable-membrane";
import { getRegisteredController } from "../controller/register";
import { GL_STORE_UPDATED_EVENT } from "../namings";

export function createLocalStore(controllerName, defaultValue) {
  if (typeof defaultValue !== "object" || defaultValue === null)
    throw new Error("You must provide an object for a store default value.");

  const dataStore = defaultValue ?? {};
  const mutationProxy = new ObservableMembrane({
    valueMutated(_, key) {
      const controllerObject = getRegisteredController(controllerName);

      controllerObject.callEvent(GL_STORE_UPDATED_EVENT, key);
    },
  });

  const proxiedDataStore = mutationProxy.getProxy(dataStore);

  function get() {
    return proxiedDataStore;
  }

  function onChange(callback) {
    onChangeCallbacks.push(callback);
  }

  const newStore = {
    get,
    onChange,
    attachedTo: controllerName,
  };

  return newStore;
}
