import { directive } from "../directive";
import { GL_STORE_UPDATED_EVENT } from "../namings";
import createReactivityFunction from "../reactivity";
import { setElementTextContent } from "../utils/dom";

directive("hook", (el, ElementController, { getDirectiveAttr }) => {
  const hookStructure = getDirectiveAttr();

  // Destructuring the hook structure
  const [variablesToHookOn, hookEventName] = hookStructure.split(":");
  const acceptedVariables = variablesToHookOn.split(",");

  // Clear the element content
  el.innerHTML = "";

  // Getting the initial display value so we can swap it with the "none" if there is no return
  const initialDisplayValue = el.style.display;

  const shouldElementReactTo = createReactivityFunction(hookStructure);

  function onStoreUpdate(key) {
    if (!shouldElementReactTo(key)) return;

    const variablesMappedFromKeys = acceptedVariables.map((variableName) =>
      ElementController.$store.get(variableName)
    );

    // The call event method returns the last return from the callback list or null if nothing is returned
    let lastCallbackResponse = ElementController.callEvent(
      hookEventName,
      variablesMappedFromKeys // We pass the array of mapped values to the data parameter
    );

    const newTextContent = lastCallbackResponse ?? "";
    setElementTextContent(el, newTextContent);

    if (!newTextContent) el.style.display = "none";
    else el.style.display = initialDisplayValue;
  }

  ElementController.on(GL_STORE_UPDATED_EVENT, onStoreUpdate);

  // We take global store updates as well
  window.GreenLight.$globalStore.onChange((key) => onStoreUpdate(`$g.${key}`));

  onStoreUpdate(acceptedVariables[0]); // First update on init
});
