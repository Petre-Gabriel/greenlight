import { directive } from "../directive";
import { evaluateExpressionForElement } from "../evaluator";
import { GL_STORE_UPDATED_EVENT } from "../namings";
import createReactivityFunction from "../reactivity";

directive("if", (el, ElementController, { getDirectiveAttr }) => {
  const ifConditionKey = getDirectiveAttr();
  const initialDisplayValue = el.style.display;

  const shouldElementReactTo = createReactivityFunction(ifConditionKey);

  async function updateShowStatus(key) {
    if (!shouldElementReactTo(key)) return;

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
