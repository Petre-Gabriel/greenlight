import { getRegisteredController } from "../controller/register";
import { directive, getDirectiveAttr } from "../directive";
import { GL_STORE_UPDATED_EVENT } from "../namings";
import { getElementControllerName } from "../structure";
import { setElementTextContent } from "../utils/dom";

/**
 * TODO: Accept multiple variables to hook on. Ex: gl-hook="email,username,password:onLoginFormUpdate"
 *
 */
directive("hook", (el) => {
  const controllerName = getElementControllerName(el);
  const ElementController = getRegisteredController(controllerName);

  const hookStructure = getDirectiveAttr("hook", el);

  // Destructuring the hook structure
  const [variableToHookOn, hookEventName] = hookStructure.split(":");

  // Clear the element content
  el.innerHTML = "";

  // Getting the initial display value so we can swap it with the "none" if there is no return
  const initialDisplayValue = el.style.display;

  function onStoreUpdate(key) {
    if (key !== variableToHookOn) return;

    // The call event method returns the last return from the callback list or null if nothing is returned
    let lastCallbackResponse = ElementController.callEvent(
      hookEventName,
      ElementController.$store.get()[variableToHookOn]
    );

    const newTextContent = lastCallbackResponse ?? "";
    setElementTextContent(el, newTextContent);

    if (!newTextContent) el.style.display = "none";
    else el.style.display = initialDisplayValue;
  }

  ElementController.on(GL_STORE_UPDATED_EVENT, onStoreUpdate);
  onStoreUpdate(variableToHookOn); // First update on init
});
