import { directive, getDirectiveAttr, getDirectiveData } from "../directive";
import { getOrderedDirectiveVariable } from "../evaluator";
import { GL_STORE_UPDATED_EVENT } from "../namings";
import { setElementTextContent } from "../utils/dom";

directive("template", (el, ElementController) => {
  const givenTemplate = getDirectiveAttr("template", el);

  const replaceVariableRegex = /({[a-zA-Z0-9_]+})/g;
  const replaceBracketsRegex = /[{}]/g;

  const matchedVariables = givenTemplate.match(replaceVariableRegex);
  const matchedVariableKeys = matchedVariables.map((variable) =>
    variable.replaceAll(replaceBracketsRegex, "")
  );

  function updateTemplate(key) {
    if (!matchedVariableKeys.includes(key)) return;

    const replacedTemplateContent = givenTemplate.replaceAll(
      replaceVariableRegex,
      (variableString) => {
        const variableName = variableString.replaceAll(
          replaceBracketsRegex,
          ""
        );

        const valueFromStore = getOrderedDirectiveVariable(el, variableName);

        return valueFromStore ?? "";
      }
    );

    setElementTextContent(el, replacedTemplateContent);
  }

  ElementController.on(GL_STORE_UPDATED_EVENT, updateTemplate);
  updateTemplate(matchedVariableKeys[0]);
});
