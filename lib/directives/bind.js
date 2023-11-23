import { directive, getDirectiveAttr, getDirectiveData } from "../directive";
import { isElementInput, setElementTextContent } from "../utils/dom";
import { GL_STORE_UPDATED_EVENT } from "../namings";

/**
 * TODO: Accept nested values for the bind directive
 * TODO: Accept a key that makes the directive take data from the global store. Example: $posts -> $ makes it take the global store value
 */
directive("bind", (el, ElementController) => {
  const bindKey = getDirectiveAttr("bind", el);
  const directiveData = getDirectiveData(el); // Data set for directive ( useful for gl-for directive to send data ) -> It has priority

  function updateValue(updatedKey) {
    if (updatedKey !== bindKey) return;

    // Get data from map, if not default to null
    const dataFromDirectiveStore = directiveData
      ? directiveData[bindKey]
      : null;

    const bindedValue =
      dataFromDirectiveStore ?? ElementController.$store.get()[bindKey] ?? "";

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
