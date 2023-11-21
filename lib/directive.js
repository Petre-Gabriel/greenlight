import { GL_DIRECTIVES_PREFIX } from "./config";

const GL_DIRECTIVE_MAP = new Map();
const GL_DIRECTIVE_DATA = new Map();

export function setDirectiveData(el, data) {
  GL_DIRECTIVE_DATA.set(el, data);
}

export function deleteDirectiveData(el) {
  GL_DIRECTIVE_DATA.delete(el);
}

export function getDirectiveData(el) {
  return GL_DIRECTIVE_DATA.get(el) ?? null;
}

export function attachDirectivesToElement(el) {
  GL_DIRECTIVE_MAP.forEach((callback, directiveName) => {
    if (!doesElementHaveDirective(el, directiveName)) return;

    callback(el);
  });
}

export function doesElementHaveDirective(el, name) {
  return el.hasAttribute(GL_DIRECTIVES_PREFIX + name);
}

export function getDirectiveAttr(name, el) {
  return el.getAttribute(GL_DIRECTIVES_PREFIX + name);
}

/**
 *
 * @param {string} name
 * @param {function} callback
 */
export function directive(name, callback) {
  if (GL_DIRECTIVE_MAP.get(name))
    throw new Error(`You already registered the "${name}" directive`);

  GL_DIRECTIVE_MAP.set(name, callback);
}
