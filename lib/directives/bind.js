import { directive } from "../directive";
import {
  isElementInput,
  setElementTextContent,
  shouldUseOnChangeEvent,
} from "../utils/dom";
import { GL_STORE_UPDATED_EVENT } from "../namings";
import {
  evaluateExpressionForElement,
  setObjectNestedProperty,
} from "../evaluator";
import createReactivityFunction from "../reactivity";

/**
 * There will be prefixes accepted for more situations:
 * $ - global store
 * N/A - controller store / directive data
 */
directive(
  "bind",
  async (
    el,
    ElementController,
    { auxiliar: bindingPoint, getDirectiveAttr }
  ) => {
    const bindProperty = getDirectiveAttr();

    const shouldElementReactTo = createReactivityFunction(bindProperty);

    async function updateValue(updatedKey) {
      if (!shouldElementReactTo(updatedKey)) return;

      const bindedValue = await evaluateExpressionForElement(el, bindProperty);

      if (bindingPoint === "default" || bindingPoint === "text") {
        if (isElementInput(el)) el.value = bindedValue;
        else setElementTextContent(el, bindedValue);
      } else {
        // We are using the evaluator to accept nested values.
        setObjectNestedProperty(el, bindingPoint, bindedValue);
      }
    }

    // If we have any of the following bind points, we need to bind to the input event
    const isSetToBindToInput = ["value", "text", "default"].includes(
      bindingPoint
    );

    if (isElementInput(el) && isSetToBindToInput) {
      // We check if he is trying to bind to the global store directly
      if (bindProperty.startsWith("$g."))
        return console.warn(
          "[GreenLight] You can't bind input value to the global store directly.",
          el
        );

      function onElementChange({ target: EventTarget }) {
        ElementController.$store.set(bindProperty, EventTarget.value);
      }

      // For radio and checkbox we use the on change event
      if (shouldUseOnChangeEvent(el))
        el.addEventListener("change", onElementChange);
      else el.addEventListener("input", onElementChange);
    }

    ElementController.on(GL_STORE_UPDATED_EVENT, updateValue); // When the controller store updates

    // We take global store updates as well
    window.GreenLight.$globalStore.onChange((key) => updateValue(`$g.${key}`));

    updateValue(bindProperty); // On init, it updates
  }
);
