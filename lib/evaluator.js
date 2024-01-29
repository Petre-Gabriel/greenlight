import { getElementController } from "./controller/register";
import { getDirectiveData } from "./directive";
import lodashGet from "lodash.get";
import lodashSet from "lodash.set";

let evaluatorFunction = new Function(
  "expressionString",
  "scope",
  // We use try finally to catch any error such as undefined variable and return empty string if that's the case.
  `with(scope) { try { return ( expressionString ); } finally { return ""; } }`
);

export function evaluateExpression(expressionString, scope) {
  return evaluatorFunction(expressionString, scope);
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

export function evaluateExpressionForElement(el, expressionString) {
  const scope = getScopeObjectFromEl(el);

  return evaluateExpression(expressionString, scope);
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

export function setObjectNestedProperty(scope, property, value) {
  return lodashSet(scope, property, value);
}

export function getObjectNestedProperty(scope, property) {
  return lodashGet(scope, property, "");
}
