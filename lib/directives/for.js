import {
  deleteDirectiveData,
  directive,
  getDirectiveAttr,
  getDirectiveData,
  setDirectiveData,
} from "../directive";
import { computeElement } from "../interpretor";
import { GL_STORE_UPDATED_EVENT } from "../namings";
import { walkDom } from "../processor";

// Took this from Alpine who took it from VueJS 2.* Core -> Thanks both ig :)
function parseForExpression(expression) {
  let forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
  let stripParensRE = /^\s*\(|\)\s*$/g;
  let forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/;
  let inMatch = expression.match(forAliasRE);

  if (!inMatch) return;

  let res = {};
  res.items = inMatch[2].trim();
  let item = inMatch[1].replace(stripParensRE, "").trim();
  let iteratorMatch = item.match(forIteratorRE);

  if (iteratorMatch) {
    res.item = item.replace(forIteratorRE, "").trim();
    res.index = iteratorMatch[1].trim();

    if (iteratorMatch[2]) {
      res.collection = iteratorMatch[2].trim();
    }
  } else {
    res.item = item;
  }

  return res;
}

/**
 * For this directive, I took inspiration from AlpineJS.
 * I adapted it for GL architecture and reactivity.
 */
directive("for", (el, ElementController) => {
  // Only accept template elements.
  if (el instanceof HTMLTemplateElement === false) return;

  const forStructure = getDirectiveAttr("for", el);

  const forNamings = parseForExpression(forStructure);
  if (!forNamings)
    throw new Error(`For expression ${forStructure} is not valid.`);

  const {
    items: variableToIterate,
    item: forVariableName,
    index: forIndexName,
  } = forNamings;

  const templateEl = el;

  let lastRenderedKeys = [];
  const elLookupTable = new Map();

  function processElementWithUpdatedData(el, keyValue, idx) {
    function walkDomOnAdd(el, controllerName) {
      setDirectiveData(el, {
        [forVariableName]: keyValue,
        [forIndexName]: idx,
      });
      computeElement(el, controllerName);
    }

    walkDomOnAdd(el, ElementController.name);
    walkDom(el, walkDomOnAdd, ElementController.name);
  }

  function updateContent(key) {
    if (key !== variableToIterate) return;

    const toIterateFromStore =
      ElementController.$store.get()[variableToIterate];

    // Updated to fit more cases
    if (!Array.isArray(toIterateFromStore)) return;

    const elementsToRemove = [],
      elementsToMove = [],
      elementsToAdd = [],
      sameElements = [];

    lastRenderedKeys.forEach((lastKey) => {
      if (toIterateFromStore.indexOf(lastKey) === -1)
        elementsToRemove.push(lastKey);
    });

    lastRenderedKeys = lastRenderedKeys.filter(
      (key) => !elementsToRemove.includes(key)
    );

    let lastKeyPos = "template";

    toIterateFromStore.forEach((newKey, newIdx) => {
      const prevIdx = lastRenderedKeys.indexOf(newKey);

      if (prevIdx === -1) {
        // New key found
        lastRenderedKeys.splice(newIdx, 0, newKey);

        elementsToAdd.push([lastKeyPos, newIdx]);
      } else if (prevIdx !== newIdx) {
        // Element moved in array
        let keyInSpot = lastRenderedKeys.splice(newIdx, 1)[0];
        let keyForSpot = lastRenderedKeys.splice(prevIdx - 1, 1)[0]; // -1 because we took an element before, so the length is smaller

        // Move keys around
        lastRenderedKeys.splice(newIdx, 0, keyForSpot);
        lastRenderedKeys.splice(prevIdx, 0, keyInSpot);

        elementsToMove.push([keyInSpot, keyForSpot, newIdx, prevIdx]);
      } else {
        sameElements.push(newKey);
      }

      lastKeyPos = newKey;
    });

    // Remove elements from the DOM and from the lookup table
    elementsToRemove.forEach((keyToRemove) => {
      const elToRemove = elLookupTable.get(keyToRemove);

      if (!elToRemove) return;

      removeGLElement(elToRemove);

      elLookupTable.delete(keyToRemove);
    });

    // Move elements around according to their new position
    elementsToMove.forEach(([keyInSpot, keyForSpot, inSpotId, forSpotId]) => {
      const elInSpot = elLookupTable.get(keyInSpot);
      const elForSpot = elLookupTable.get(keyForSpot);

      if (!elForSpot) return;

      const marker = document.createElement("div");

      processElementWithUpdatedData(elInSpot, keyInSpot, inSpotId);
      processElementWithUpdatedData(elForSpot, keyForSpot, forSpotId);

      // Swap the elements
      elForSpot.after(marker);
      elInSpot.after(elForSpot);
      marker.before(elInSpot);
      marker.remove();
    });

    // We add new elemnets -> lastKey is the key after the element is inserted
    // If first, it will be the template element
    elementsToAdd.forEach(([lastKey, idx]) => {
      const lastEl =
        lastKey === "template" ? templateEl : elLookupTable.get(lastKey);
      const keyValue = toIterateFromStore[idx];

      const newElement = el.content.firstElementChild.cloneNode(true);

      // We are adding the specific data for it
      processElementWithUpdatedData(newElement, keyValue, idx);

      elLookupTable.set(keyValue, newElement);

      lastEl.after(newElement);
    });

    lastRenderedKeys = toIterateFromStore;

    // The elements that didn't change position
    sameElements.forEach((elKey) => {
      const element = elLookupTable.get(elKey);

      if (!element) return;

      processElementWithUpdatedData(
        element,
        elKey,
        lastRenderedKeys.indexOf(elKey)
      );
    });
  }

  ElementController.on(GL_STORE_UPDATED_EVENT, updateContent);
  updateContent(variableToIterate);
});
