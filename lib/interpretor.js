import { isElementController } from "./controller/register";
import { attachDirectivesToElement } from "./directive";
import { setElementControllerName } from "./structure";

export function computeElement(el, controllerName) {
  // So we can keep track of the parent controller
  setElementControllerName(el, controllerName);

  // We attach all the existing directives on the element
  attachDirectivesToElement(el);
}
