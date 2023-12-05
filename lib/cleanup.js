import { deleteDirectiveData } from "./directive";
import { walkDom } from "./processor";

export function removeGLElement(el, controllerName) {
  function walkDomOnRemove(el) {
    deleteDirectiveData(el);
  }

  walkDom(el, walkDomOnRemove, controllerName);

  el.remove();
}
