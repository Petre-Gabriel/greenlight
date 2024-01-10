import { GL_STORE_UPDATED_EVENT } from "../namings";
import { getObjectScopedProperty, setObjectScopedProperty } from "../evaluator";
import { getRegisteredControllerByName } from "../controller/register";

export function createAndAttachStore(controllerName, defaultValue) {
  if (typeof defaultValue !== "object" || defaultValue === null)
    throw new Error("You must provide an object for a store default value.");

  const dataStore = defaultValue ?? {};

  function get(property) {
    if (!property) return dataStore;

    return getObjectScopedProperty(dataStore, property);
  }

  function set(property, value) {
    setObjectScopedProperty(dataStore, property, value);

    // Side effect for reactivity.
    const AssignedController = getRegisteredControllerByName(controllerName);
    AssignedController.callEvent(GL_STORE_UPDATED_EVENT, property);
  }

  const newStore = {
    get,
    set,
    attachedTo: controllerName,
  };

  return newStore;
}
