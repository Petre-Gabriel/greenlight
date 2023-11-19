import { getRegisteredController } from "../controller/register";
import { directive, getDirectiveAttr } from "../directive";
import { getElementControllerName } from "../structure";
import { GL_STORE_UPDATED_EVENT } from "../namings";

directive("if", (el) => {
  const controllerName = getElementControllerName(el);
  const ElementController = getRegisteredController(controllerName);

  const ifConditionKey = getDirectiveAttr("if", el);
  const initialDisplayValue = el.style.display;

  function updateShowStatus() {
    const conditionKeyValue = ElementController.$store.get()[ifConditionKey];
    console.log("here", conditionKeyValue);

    if (!conditionKeyValue) el.style.display = "none";
    else el.style.display = initialDisplayValue;
  }

  ElementController.on(GL_STORE_UPDATED_EVENT, updateShowStatus);
  updateShowStatus();
});
