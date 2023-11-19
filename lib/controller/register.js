import { doesElementHaveDirective } from "../directive";

const ControllersMap = new Map();

export function registerController(name, controllerObject) {
  if (ControllersMap.get(name))
    throw new Error(`Controller ${name} is already registered.`);

  ControllersMap.set(name, controllerObject);
}

export function getRegisteredController(name) {
  return ControllersMap.get(name) ?? null;
}

export function isElementController(el) {
  return doesElementHaveDirective(el, "controller");
}
