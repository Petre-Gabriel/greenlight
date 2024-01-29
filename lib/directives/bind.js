import { directive, getDirectiveAttr } from "../directive";
import { isElementInput, setElementTextContent } from "../utils/dom";
import { GL_STORE_UPDATED_EVENT } from "../namings";
import {
  getScopedPropertyFromElement,
  setObjectNestedProperty,
} from "../evaluator";

/**
 * There will be prefixes accepted for more situations:
 * $ - global store
 * N/A - controller store / directive data
 */
directive("bind", (el, ElementController) => {
  const bindContext = getDirectiveAttr("bind", el);

  // Separate by comma and trim the results
  const bindPairs = bindContext.split(",").map((pair) => pair.trim());

  // We add the default text in case there is no binding point
  const processedBindPairs = bindPairs.map((pair) => {
    let [bindProperty, bindPoint] = pair.split("@");

    if (!bindPoint || bindPoint.length === 0) bindPoint = "default";

    return [bindProperty, bindPoint];
  });

  // We get separate arrays for the properties and the binding points for checks
  const bindProperties = processedBindPairs.map((pair) => pair[0].trim());
  const bindPoints = processedBindPairs.map(
    (pair) => pair[1].trim() ?? "default"
  );

  function updateValue(updatedKey) {
    // Check if the bindProperties are included in the updated key and vice-versa to match all cases.
    if (
      !bindProperties.some(
        (bindProperty) =>
          bindProperty.startsWith(updatedKey) ||
          updatedKey.startsWith(bindProperty)
      )
    )
      return;

    processedBindPairs.forEach((bindPair) => {
      const [bindProperty, bindingPoint] = bindPair;

      const bindedValue = getScopedPropertyFromElement(el, bindProperty);

      // We take care of the default behaviour first, returning early.
      if (bindingPoint === "default" || bindingPoint === "text") {
        if (isElementInput(el)) el.value = bindedValue;
        else setElementTextContent(el, bindedValue);
      } else {
        // We are using the evaluator to accept nested values.
        setObjectNestedProperty(el, bindingPoint, bindedValue);
      }
    });
  }

  // If we have any of the following bind points, we need to bind to the input event
  const isSetToBindToInput =
    bindPoints.includes("value") ||
    bindPoints.includes("text") ||
    bindPoints.includes("default");

  if (isElementInput(el) && isSetToBindToInput) {
    processedBindPairs.forEach((bindPair) => {
      const [bindProperty, bindingPoint] = bindPair;

      // If is other than the default, we don't need it
      if (
        bindingPoint &&
        !["default", "value", "", "text"].includes(bindingPoint)
      )
        return;

      // We check if he is trying to bind to the global store directly
      if (bindProperty.startsWith("$"))
        return console.warn(
          "[GreenLight] You can't bind input value to the global store directly.",
          el
        );

      function onElementChange({ target: EventTarget }) {
        ElementController.$store.set(bindProperty, EventTarget.value);
      }

      el.addEventListener("input", onElementChange);
    });
  }

  ElementController.on(GL_STORE_UPDATED_EVENT, updateValue); // When the controller store updates

  // We take global store updates as well
  window.GreenLight.$globalStore.onChange((key) => updateValue(`$${key}`));

  updateValue(bindProperties[0]); // On init, it updates
});
