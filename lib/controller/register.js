import { doesElementHaveDirective } from "../directive";
import { getElementControllerName } from "../structure";

const ControllersMap = new Map();

export function registerController(name, controllerObject) {
  if (ControllersMap.get(name))
    throw new Error(`Controller ${name} is already registered.`);

  ControllersMap.set(name, controllerObject);
}

export function getElementController(el) {
  const controllerName = getElementControllerName(el);

  return getRegisteredControllerByName(controllerName);
}

export function getRegisteredControllerByName(name) {
  return ControllersMap.get(name) ?? null;
}

export function isElementController(el) {
  return doesElementHaveDirective(el, "controller");
}
