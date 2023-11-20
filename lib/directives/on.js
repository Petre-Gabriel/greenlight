import { getRegisteredController } from "../controller/register";
import { directive, getDirectiveAttr } from "../directive";
import { getElementControllerName } from "../structure";

directive("on", (el) => {
  const controllerName = getElementControllerName(el);
  const ElementController = getRegisteredController(controllerName);

  const onEventStructure = getDirectiveAttr("on", el);
  const [domEvent, controllerEvent] = onEventStructure.split(":");

  el.addEventListener(domEvent, (event) => {
    ElementController.callEvent(controllerEvent, event);
  });
});
