import { directive, getDirectiveAttr } from "../directive";
import { getScopedPropertyFromElement } from "../evaluator";
import { GL_STORE_UPDATED_EVENT } from "../namings";
import { setElementTextContent } from "../utils/dom";
import { getBindPointsFromEl } from "../utils/directives";

directive("template", (el, ElementController) => {
  const givenTemplate = getDirectiveAttr("template", el);

  const replaceVariableRegex = /({[a-zA-Z0-9_.]+})/g;
  const replaceBracketsRegex = /[{}]/g;

  const matchedVariables = givenTemplate.match(replaceVariableRegex);
  const matchedVariableKeys = matchedVariables.map((variable) =>
    variable.replaceAll(replaceBracketsRegex, "")
  );

  const processedBindingPoints = getBindPointsFromEl(el);

  function updateTemplate(key) {
    if (!matchedVariableKeys.includes(key)) return;

    const replacedTemplateContent = givenTemplate.replaceAll(
      replaceVariableRegex,
      (variableString) => {
        const variableName = variableString.replaceAll(
          replaceBracketsRegex,
          ""
        );

        const valueFromStore = getScopedPropertyFromElement(el, variableName);

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
  updateTemplate(matchedVariableKeys[0]);
});
