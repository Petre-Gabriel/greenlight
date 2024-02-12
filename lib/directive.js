import { GL_DIRECTIVES_AUXILIAR_CHAR, GL_DIRECTIVES_PREFIX } from "./config";
import { getElementController } from "./controller/register";

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
  const ElementController = getElementController(el);
  const ElementsAttributes = el.getAttributeNames();

  ElementsAttributes.forEach((directiveNameWithAuxiliar) => {
    const directiveParams = directiveNameWithAuxiliar.split(
      GL_DIRECTIVES_AUXILIAR_CHAR
    );

    const directiveName = directiveParams[0];
    const directiveAuxiliar = directiveParams[1] ?? "default";

    const directiveCallback = GL_DIRECTIVE_MAP.get(directiveName);

    if (!directiveCallback) return;

    directiveCallback(el, ElementController, {
      auxiliar: directiveAuxiliar,
      getDirectiveAttr: getDirectiveAttr.bind(
        null,
        auxiliar === "default" ? directiveName : directiveNameWithAuxiliar,
        el
      ),
    });
  });
}

export function getElementDirectiveAuxiliars(el, name) {
  const elAttributes = el.getAttributeNames();
  const directiveName = GL_DIRECTIVES_PREFIX + name;

  return elAttributes
    .filter(
      (attr) => attr.split(GL_DIRECTIVES_AUXILIAR_CHAR)[0] === directiveName
    )
    .map((attr) => attr.split(GL_DIRECTIVES_AUXILIAR_CHAR)[1] ?? "default");
}

export function doesElementHaveDirective(el, name) {
  const elAttributes = el.getAttributeNames();
  const directiveName = GL_DIRECTIVES_PREFIX + name;

  return elAttributes.some(
    (attr) => attr.split(GL_DIRECTIVES_AUXILIAR_CHAR)[0] === directiveName
  );
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
