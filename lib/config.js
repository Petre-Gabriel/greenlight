export const GL_DIRECTIVES_PREFIX = "gl-";
export const GL_EVENT_PREFIX = "gl";

export function generateControllerEventName(controllerName, eventName) {
  return `${GL_EVENT_PREFIX}:${controllerName}:${eventName}`;
}
