// This is used to keep track of the controllers and its childs

const GL_ELEMENTS_CONTROLLER = new Map();

export function getElementControllerName(el) {
  return GL_ELEMENTS_CONTROLLER.get(el);
}

export function setElementControllerName(el, controllerName) {
  return GL_ELEMENTS_CONTROLLER.set(el, controllerName);
}
