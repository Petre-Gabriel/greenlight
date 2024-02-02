import { directive, getDirectiveAttr } from "../directive";
import { evaluateExpressionForElement } from "../evaluator";
import { GL_STORE_UPDATED_EVENT } from "../namings";

directive("if", (el, ElementController) => {
  const ifConditionKey = getDirectiveAttr("if", el);
  const initialDisplayValue = el.style.display;

  async function updateShowStatus(key) {
    if (!ifConditionKey.includes(key) && !key.includes(ifConditionKey)) return;

    const conditionKeyValue = await evaluateExpressionForElement(
      el,
      ifConditionKey
    );

    if (conditionKeyValue) el.style.display = initialDisplayValue;
    else el.style.display = "none";
  }

  ElementController.on(GL_STORE_UPDATED_EVENT, updateShowStatus);

  // We take global store updates as well
  window.GreenLight.$globalStore.onChange((key) =>
    updateShowStatus(`$g.${key}`)
  );

  updateShowStatus(ifConditionKey);
});
