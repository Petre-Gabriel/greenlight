import { getRegisteredController } from "../controller/register";
import { directive, getDirectiveAttr } from "../directive";
import { getElementControllerName } from "../structure";
import { isElementInput } from "../utils/dom";
import { GL_STORE_UPDATED_EVENT } from "../namings";

/**
 * TODO: Accept nested values for the bind directive
 */
directive("bind", (el) => {
  const controllerName = getElementControllerName(el);
  const ElementController = getRegisteredController(controllerName);

  const bindKey = getDirectiveAttr("bind", el);

  function updateValue() {
    const bindedValue = ElementController.$store.get()[bindKey] ?? "";
    if (isElementInput(el)) el.value = bindedValue;
    else {
      const newTextNode = document.createTextNode(bindedValue);
      el.innerHTML = "";
      el.appendChild(newTextNode);
    }
  }

  if (isElementInput(el)) {
    function onElementChange({ target: EventTarget }) {
      ElementController.$store.get()[bindKey] = EventTarget.value;
    }

    el.addEventListener("input", onElementChange);
  }

  ElementController.on(GL_STORE_UPDATED_EVENT, updateValue); // When the controller store updates
  updateValue(); // On init, it updates
});
