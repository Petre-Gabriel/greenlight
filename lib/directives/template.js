import { directive, getDirectiveAttr } from "../directive";
import { getScopedPropertyFromElement } from "../evaluator";
import { GL_STORE_UPDATED_EVENT } from "../namings";
import { setElementTextContent } from "../utils/dom";
import { getBindPointsFromEl } from "../utils/directives";

directive("template", (el, ElementController) => {
  const givenTemplate = getDirectiveAttr("template", el);

  // We take the regex that accepts characters, numbers and symbols needed for the variable name.
  // Accepted characters: a-z, A-Z, 0-9, _, ., [, ], $
  const replaceVariableRegex = /({[a-zA-Z0-9_.\[\]\$]+})/g;
  const replaceBracketsRegex = /[{}]/g;

  const matchedVariables = givenTemplate.match(replaceVariableRegex);
  const matchedVariableKeys = matchedVariables.map((variable) =>
    variable.replaceAll(replaceBracketsRegex, "")
  );

  const processedBindingPoints = getBindPointsFromEl(el);

  function updateTemplate(key) {
    if (
      !matchedVariableKeys.includes(key) &&
      // It's also reversed because of nested objects and edge-cases.
      matchedVariableKeys?.filter((matchedVar) => key.includes(matchedVar))
        .length === 0
    )
      return;

    const replacedTemplateContent = givenTemplate.replaceAll(
      replaceVariableRegex,
      (variableString) => {
        const variableName = variableString.replaceAll(
          replaceBracketsRegex,
          ""
        );

        const valueFromStore = getScopedPropertyFromElement(
          el,
          variableName,
          true
        );

        return valueFromStore ?? "";
      }
    );

    processedBindingPoints.forEach((bindPoint) => {
      if (bindPoint === "default" || bindPoint === "text") {
        setElementTextContent(el, replacedTemplateContent);
        return;
      }

      el[bindPoint] = replacedTemplateContent;
    });
  }

  ElementController.on(GL_STORE_UPDATED_EVENT, updateTemplate);

  // We take global store updates as well
  window.GreenLight.$globalStore.onChange((key) => updateTemplate(`$${key}`));

  updateTemplate(matchedVariableKeys[0]);
});
