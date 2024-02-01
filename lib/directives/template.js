import { directive, getDirectiveAttr, getDirectiveData } from "../directive";
import { evaluateExpressionForElement } from "../evaluator";
import { GL_STORE_UPDATED_EVENT } from "../namings";
import { setElementTextContent } from "../utils/dom";
import { getBindPointsFromEl } from "../utils/directives";
import { replaceAllAsync } from "../utils/asyncMethods";

directive("template", (el, ElementController) => {
  const givenTemplate = getDirectiveAttr("template", el);

  // We take the regex that accepts characters, numbers and symbols needed for the variable name.
  // Accepted characters: a-z, A-Z, 0-9, _, ., [, ], $
  const replaceVariableRegex = /({[^{}]+})/g;
  const replaceBracketsRegex = /[{}]/g;

  const matchedVariables = givenTemplate.match(replaceVariableRegex);
  const matchedVariableKeys =
    matchedVariables?.map((variable) =>
      variable.replaceAll(replaceBracketsRegex, "")
    ) ?? [];

  const processedBindingPoints = getBindPointsFromEl(el);

  async function updateTemplate(key) {
    if (
      matchedVariableKeys?.filter(
        (matchedVar) => matchedVar.includes(key) || key.includes(matchedVar)
      ).length === 0
    )
      return;

    // We use an internal method to replace the variables because we need to support async replacement.
    const replacedTemplateContent = await replaceAllAsync(
      givenTemplate,
      replaceVariableRegex,
      async (variableString) => {
        const variableName = variableString.replaceAll(
          replaceBracketsRegex,
          ""
        );

        const valueFromStore = await evaluateExpressionForElement(
          el,
          variableName
        );

        return valueFromStore ?? "";
      }
    );

    // const replacedTemplateContent = givenTemplate.replaceAll(
    //   replaceVariableRegex,
    //   (variableString) => {
    //     const variableName = variableString.replaceAll(
    //       replaceBracketsRegex,
    //       ""
    //     );

    //     const valueFromStore = getScopedPropertyFromElement(el, variableName);

    //     return valueFromStore ?? "";
    //   }
    // );

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
  window.GreenLight.$globalStore.onChange((key) => updateTemplate(`$g.${key}`));

  updateTemplate(matchedVariableKeys[0]);
});
