import { directive, getDirectiveAttr } from "../directive";
import { isElementInput, setElementTextContent } from "../utils/dom";
import { GL_STORE_UPDATED_EVENT } from "../namings";
import { getScopedPropertyFromElement } from "../evaluator";
import { getBindPointsFromEl } from "../utils/directives";

/**
 * There will be prefixes accepted for more situations:
 * $ - global store
 * N/A - controller store / directive data
 */
directive("bind", (el, ElementController) => {
  const bindProperty = getDirectiveAttr("bind", el);

  const processedBindingPoints = getBindPointsFromEl(el);

  function updateValue(updatedKey) {
    if (
      !updatedKey.includes(bindProperty) &&
      !bindProperty.includes(updatedKey)
    )
      return;

    const bindedValue = getScopedPropertyFromElement(el, bindProperty);

    processedBindingPoints.forEach((bindingPoint) => {
      // We take care of the default behaviour first
      if (bindingPoint === "default" || bindingPoint === "text") {
        if (isElementInput(el)) el.value = bindedValue;
        else setElementTextContent(el, bindedValue);

        return;
      }

      el[bindingPoint] = bindedValue;
    });
  }

  if (isElementInput(el)) {
    if (bindProperty.startsWith("$"))
      return console.warn(
        "[GreenLight] You can't bind input value to the global store directly.",
        el
      );

    function onElementChange({ target: EventTarget }) {
      ElementController.$store.set(bindProperty, EventTarget.value);
    }

    el.addEventListener("input", onElementChange);
  }

  ElementController.on(GL_STORE_UPDATED_EVENT, updateValue); // When the controller store updates

  // We take global store updates as well
  window.GreenLight.$globalStore.onChange((key) => updateValue(`$${key}`));

  updateValue(bindProperty); // On init, it updates
});
