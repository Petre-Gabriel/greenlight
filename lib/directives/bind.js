import { directive, getDirectiveAttr } from "../directive";
import { isElementInput, setElementTextContent } from "../utils/dom";
import { GL_STORE_UPDATED_EVENT } from "../namings";
import { getScopedPropertyFromElement } from "../evaluator";

/**
 * TODO: Accept nested values for the bind directive
 * TODO: Accept a key that makes the directive take data from the global store. Example: $posts -> $ makes it take the global store value
 *
 * There will be prefixes accepted for more situations:
 * $ - global store
 * # - directive data ( for templates )
 */
directive("bind", (el, ElementController) => {
  const bindProperty = getDirectiveAttr("bind", el);

  function updateValue(updatedKey) {
    if (
      !updatedKey.includes(bindProperty) &&
      !bindProperty.includes(updatedKey)
    )
      return;

    const bindedValue = getScopedPropertyFromElement(el, bindProperty);

    if (isElementInput(el)) el.value = bindedValue;
    else setElementTextContent(el, bindedValue);
  }

  if (isElementInput(el)) {
    function onElementChange({ target: EventTarget }) {
      // setScopedPropertyFromElement(el, bindProperty, EventTarget.value);
      ElementController.$store.set(bindProperty, EventTarget.value);
    }

    el.addEventListener("input", onElementChange);
  }

  ElementController.on(GL_STORE_UPDATED_EVENT, updateValue); // When the controller store updates
  updateValue(bindProperty); // On init, it updates
});
