import { ObservableMembrane } from "observable-membrane";
import { dispatchControllerEvent } from "../controller/events";
import { generateControllerEventName } from "../config";
import { getRegisteredController } from "../controller/register";

export function createLocalStore(controllerName, defaultValue) {
  if (typeof defaultValue !== "object" || defaultValue === null)
    throw new Error("You must provide an object for a store default value.");

  const dataStore = defaultValue ?? {};
  const mutationProxy = new ObservableMembrane({
    valueMutated(_, key) {
      const controllerObject = getRegisteredController(controllerName);

      controllerObject.callEvent("storeUpdated", key);
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
