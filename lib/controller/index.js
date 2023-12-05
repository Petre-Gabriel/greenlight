import { generateControllerEventName } from "../config";
import { createLocalStore } from "../store/localStore";
import { registerController } from "./register";

/**
 * TODO: Update the `on` and `callEvent` to utilize the browser's native Events
 */
export function createAndRegisterController(name, root) {
  if (!root) throw new Error("You must provide a root for the controller");
  if (!name) throw new Error("You should provide a name for the controller");

  const localStore = createLocalStore(name, {});

  const listeners = new Map();

  function on(eventName, callback) {
    // Generated based on the config and the controller name
    const generatedEventName = generateControllerEventName(name, eventName);

    if (!listeners.get(generatedEventName))
      listeners.set(generatedEventName, [callback]);
    else {
      const callbacksArray = listeners.get(generatedEventName);
      callbacksArray.push(callback);
    }
  }

  function callEvent(eventName, data) {
    // Generated based on the config and the controller name
    const generatedEventName = generateControllerEventName(name, eventName);
    const callbackArray = listeners.get(generatedEventName);

    if (!callbackArray) return;

    let lastCallback;

    callbackArray.forEach((callback) => {
      lastCallback = callback(data);
    });

    return lastCallback ?? null;
  }

  const newController = {
    name,
    attachedTo: root,
    $store: localStore,
    on,
    callEvent,
  };

  registerController(name, newController);

  return newController;
}
