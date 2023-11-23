import {
  deleteDirectiveData,
  directive,
  getDirectiveAttr,
  setDirectiveData,
} from "../directive";
import { computeElement } from "../interpretor";
import { GL_STORE_UPDATED_EVENT } from "../namings";

/**
 * TODO: Find a better way to compute the newly generated elements.
 * TODO: Accept other types like strings to iterate over
 * TODO: Find a way to pass the index as well
 */
directive("for", (el, ElementController) => {
  // Only accept template elements.
  if (el instanceof HTMLTemplateElement === false) return;

  const forStructure = getDirectiveAttr("for", el);

  const structureValidationRegex = /([a-zA-Z]+) in ([a-zA-Z])+/g;
  if (structureValidationRegex.test(forStructure) === false) return;

  const [forVariableName, _, variableToIterate] = forStructure.split(" ");

  const latestCreatedElements = [];
  const templateParentNode = el.parentNode;

  function updateContent(key) {
    if (key !== variableToIterate) return;

    /**
     * Remove the last created elements to clear the container for new elements.
     * It also removes the directive data from memory.
     */
    latestCreatedElements.forEach((prevElement) => {
      deleteDirectiveData(prevElement);
      prevElement.remove();
    });

    latestCreatedElements.splice(0, latestCreatedElements.length); // Empty the array

    const toIterateFromStore =
      ElementController.$store.get()[variableToIterate];

    if (toIterateFromStore instanceof Array === false) return;

    toIterateFromStore.forEach((storeValue) => {
      const nodeFromTemplate = el.content.firstElementChild.cloneNode(true);

      setDirectiveData(nodeFromTemplate, {
        [forVariableName]: storeValue,
      });

      computeElement(nodeFromTemplate, ElementController.name);

      templateParentNode.appendChild(nodeFromTemplate);
      latestCreatedElements.push(nodeFromTemplate);
    });
  }

  ElementController.on(GL_STORE_UPDATED_EVENT, updateContent);
  updateContent(variableToIterate);
});
