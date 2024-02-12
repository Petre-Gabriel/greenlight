import { directive } from "../directive";
import { evaluateExpressionForElement } from "../evaluator";
import { GL_STORE_UPDATED_EVENT } from "../namings";
import { setElementTextContent } from "../utils/dom";
import { replaceAllAsync } from "../utils/asyncMethods";

directive(
  "template",
  (el, ElementController, { auxiliar: bindingPoint, getDirectiveAttr }) => {
    const givenTemplate = getDirectiveAttr();

    // We take the regex that accepts characters, numbers and symbols needed for the variable name.
    // Accepted characters: a-z, A-Z, 0-9, _, ., [, ], $
    const replaceVariableRegex = /({[^{}]+})/g;
    const replaceBracketsRegex = /[{}]/g;

    const matchedVariables = givenTemplate.match(replaceVariableRegex);
    const matchedVariableKeys =
      matchedVariables?.map((variable) =>
        variable.replaceAll(replaceBracketsRegex, "")
      ) ?? [];

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

      if (bindingPoint === "default" || bindingPoint === "text") {
        setElementTextContent(el, replacedTemplateContent);
        return;
      }

      el[bindingPoint] = replacedTemplateContent;
    }

    ElementController.on(GL_STORE_UPDATED_EVENT, updateTemplate);

    // We take global store updates as well
    window.GreenLight.$globalStore.onChange((key) =>
      updateTemplate(`$g.${key}`)
    );

    updateTemplate(matchedVariableKeys[0]);
  }
);
