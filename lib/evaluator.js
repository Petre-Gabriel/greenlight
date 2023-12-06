import { getElementController } from "./controller/register";
import { getDirectiveData } from "./directive";

/**
 * This functions returns, based on the order of priority,
 * The variable from the directive data store, the controller store or an empty string
 */
export function getOrderedDirectiveVariable(el, variableName) {
  const directiveData = getDirectiveData(el);
  const ElementController = getElementController(el);

  return (
    (directiveData && directiveData[variableName]) ??
    ElementController.$store.get()[variableName] ??
    ""
  );
}
