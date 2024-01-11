import { getElementController } from "./controller/register";
import { getDirectiveData, setDirectiveData } from "./directive";
import lodashGet from "lodash.get";
import lodashSet from "lodash.set";
import { GL_STORE_UPDATED_EVENT } from "./namings";

/**
 * This functions returns, based on the order of priority,
 * The variable from the directive data store, the controller store or an empty string
 */
export function getOrderedDirectiveVariable(el, variableName) {
  return evaluateElementExpression(el, variableName);
}

export function getScopeObjectFromEl(el) {
  const directiveData = getDirectiveData(el);
  const ElementController = getElementController(el);

  const unwrapedStore = ElementController.$store.get();

  // We return based on the scope closure order.
  // Controller store -> Directive data
  return {
    ...unwrapedStore,
    ...directiveData,
  };
}

export function evaluateElementExpression(el, key) {
  const scope = getScopeObjectFromEl(el);

  return lodashGet(scope, key, "");
}

export function setElementExpression(el, keys, value) {
  const scope = getScopeObjectFromEl(el);
  const ElementController = getElementController(el);

  const [firstKey] = keys.split(".");

  const updatedValue = lodashSet(scope, keys, value);
  const newObject =
    typeof updatedValue[firstKey] === "object"
      ? { ...updatedValue[firstKey] }
      : updatedValue[firstKey];

  // To trigger a change.
  ElementController.$store.get()[firstKey] = newObject;
}

export function getScopedPropertyFromElement(el, property) {
  // We can add this to handle global store specifically.
  if (property.startsWith("$")) {
    const globalScope = window.GreenLight.$globalStore.get();

    return lodashGet(globalScope, property.slice(1)) ?? "";
  }

  const scope = getScopeObjectFromEl(el);
  return lodashGet(scope, property) ?? "";
}

// With side effect for reactivity.
export function setScopedPropertyFromElement(el, property, value) {
  const ElementController = getElementController(el);
  const ElementStore = ElementController.$store;

  ElementStore.set(property, value);
}

export function setObjectScopedProperty(scope, property, value) {
  return lodashSet(scope, property, value);
}

export function getObjectScopedProperty(scope, property) {
  return lodashGet(scope, property, "");
}
