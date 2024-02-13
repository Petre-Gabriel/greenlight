import { directive } from "../directive";

directive("ref", (el, ElementController, { getDirectiveAttr }) => {
  const refName = getDirectiveAttr();

  ElementController.$refs.add(refName, el);
});
