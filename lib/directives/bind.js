import { getRegisteredController } from "../controller/register";
import { directive, getDirectiveAttr } from "../directive";
import { getElementControllerName } from "../structure";

directive("bind", (el) => {
  const controllerName = getElementControllerName(el);
  const ElementController = getRegisteredController(controllerName);

  const bindKey = getDirectiveAttr("bind", el);

  el.value = ElementController.$store.get()[bindKey];
});
