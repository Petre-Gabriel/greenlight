import { directive, getDirectiveAttr } from "../directive";

directive("ref", (el, ElementController) => {
  const refName = getDirectiveAttr("ref", el);

  ElementController.$refs.add(refName, el);
});
