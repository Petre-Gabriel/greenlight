import { createAndRegisterController } from "../controller";
import { directive } from "../directive";

directive("controller", (el, _, { getDirectiveAttr }) => {
  const controllerName = getDirectiveAttr();
  createAndRegisterController(controllerName, el);
});
