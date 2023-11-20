import { getRegisteredController } from "../controller/register";
import { directive, getDirectiveAttr } from "../directive";
import { getElementControllerName } from "../structure";
import { isElementInput, setElementTextContent } from "../utils/dom";
import { GL_STORE_UPDATED_EVENT } from "../namings";

/**
 * TODO: Accept nested values for the bind directive
 */
directive("bind", (el) => {
  const controllerName = getElementControllerName(el);
  const ElementController = getRegisteredController(controllerName);

  const bindKey = getDirectiveAttr("bind", el);

  function updateValue(updatedKey) {
    if (updatedKey !== bindKey) return;

    const bindedValue = ElementController.$store.get()[bindKey] ?? "";
    if (isElementInput(el)) el.value = bindedValue;
    else setElementTextContent(el, bindedValue);
  }

  if (isElementInput(el)) {
    function onElementChange({ target: EventTarget }) {
      ElementController.$store.get()[bindKey] = EventTarget.value;
    }

    el.addEventListener("input", onElementChange);
  }

  ElementController.on(GL_STORE_UPDATED_EVENT, updateValue); // When the controller store updates
  updateValue(bindKey); // On init, it updates
});
