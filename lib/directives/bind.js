import { directive, getDirectiveAttr, getDirectiveData } from "../directive";
import { isElementInput, setElementTextContent } from "../utils/dom";
import { GL_STORE_UPDATED_EVENT } from "../namings";
import { getOrderedDirectiveVariable } from "../evaluator";

/**
 * TODO: Accept nested values for the bind directive
 * TODO: Accept a key that makes the directive take data from the global store. Example: $posts -> $ makes it take the global store value
 *
 * There will be prefixes accepted for more situations:
 * $ - global store
 * # - directive data ( for templates )
 */
directive("bind", (el, ElementController) => {
  const bindKey = getDirectiveAttr("bind", el);

  function updateValue(updatedKey) {
    if (updatedKey !== bindKey) return;

    const bindedValue = getOrderedDirectiveVariable(el, bindKey);

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
