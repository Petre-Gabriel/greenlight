import { directive, getDirectiveAttr } from "../directive";
import {
  evaluateElementExpression,
  getScopedPropertyFromElement,
} from "../evaluator";
import { GL_STORE_UPDATED_EVENT } from "../namings";

directive("if", (el, ElementController) => {
  const ifConditionKey = getDirectiveAttr("if", el);
  const initialDisplayValue = el.style.display;

  function updateShowStatus() {
    const conditionKeyValue = getScopedPropertyFromElement(el, ifConditionKey);

    if (!conditionKeyValue) el.style.display = "none";
    else el.style.display = initialDisplayValue;
  }

  ElementController.on(GL_STORE_UPDATED_EVENT, updateShowStatus);
  updateShowStatus();
});
