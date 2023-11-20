import { GL_DIRECTIVES_PREFIX } from "./config";

export function walkDom(root, callback, controllerName) {
  const attachTo = root ? root : document.body;

  callback(attachTo, controllerName);

  let nextElement = attachTo.firstElementChild;

  while (nextElement) {
    walkDom(nextElement, callback, controllerName);

    nextElement = nextElement.nextElementSibling;
  }
}

const controllerDirective = GL_DIRECTIVES_PREFIX + "controller";

export function processControllers(root, callback) {
  const controllers = root.querySelectorAll(`[${controllerDirective}]`);
  const controllersArray = Array.from(controllers);

  controllersArray.forEach((controller) => {
    const controllerName = controller.getAttribute(controllerDirective);

    walkDom(controller, callback, controllerName);
  });
}
