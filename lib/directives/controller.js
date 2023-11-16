import { createAndRegisterController } from "../controller";
import { directive, getDirectiveAttr } from "../directive";

directive("controller", (el) => {
  const controllerName = getDirectiveAttr("controller", el);
  createAndRegisterController(controllerName, el);
});
