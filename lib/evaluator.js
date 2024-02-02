import { getElementController } from "./controller/register";
import { getDirectiveData } from "./directive";
import lodashGet from "lodash.get";
import lodashSet from "lodash.set";

const expressionFuncMemo = new Map();

export function getEvaluatorForExpression(expressionString) {
  const memoizedFunction = expressionFuncMemo.get(expressionString);

  if (memoizedFunction) return memoizedFunction;

  const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor;

  const evaluatorFunction = new AsyncFunction(
    "scope",
    // We use try/catch to return an empty string if there is an error. ( For example, if the property is not defined )
    `with(scope) { try { return (${expressionString}); } catch { return ""; } };`
  );

  Object.defineProperty(evaluatorFunction, "name", {
    value: `GL Eval -> ${expressionString}`,
  });

  expressionFuncMemo.set(expressionString, evaluatorFunction);

  return evaluatorFunction;
}

export function getScopeObjectFromEl(el) {
  const directiveData = getDirectiveData(el);
  const ElementController = getElementController(el);

  const unwrapedStore = ElementController.$store.get();

  const unwrapedGlobalStore = window.GreenLight.$globalStore.get();

  // We return based on the scope closure order.
  // Controller store -> Directive data
  return {
    $g: {
      ...unwrapedGlobalStore,
    },
    ...unwrapedStore,
    ...directiveData,
  };
}

export async function evaluateExpressionForElement(el, expressionString) {
  const scope = getScopeObjectFromEl(el);

  const evaluator = getEvaluatorForExpression(expressionString);

  if (typeof evaluator !== "function") return;

  try {
    const evaluatorValue = await evaluator(scope);

    return evaluatorValue ?? "";
  } catch (error) {
    console.error(
      "Fatal GL error. Could not evaluate expression:",
      el,
      expressionString,
      "Please report this issue to the GreenLight repository."
    );

    return "";
  }
}

export function getScopedPropertyFromElement(el, property) {
  // We can add this to handle global store specifically.
  if (property.startsWith("$g.")) {
    const globalScope = window.GreenLight.$globalStore.get();

    return lodashGet(globalScope, property.slice(3)) ?? "";
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
