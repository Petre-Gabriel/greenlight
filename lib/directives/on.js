import { directive, getDirectiveAttr } from "../directive";

/**
 * For this directive the content should be like:
 * gl-on="DOMEventName:ControllerEventToCall"
 */
directive("on", (el, ElementController) => {
  const onEventStructure = getDirectiveAttr("on", el);
  const [domEvent, controllerEvent] = onEventStructure.split(":");

  el.addEventListener(domEvent, (event) => {
    ElementController.callEvent(controllerEvent, event);
  });
});
