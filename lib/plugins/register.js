import { removeGLElement } from "../cleanup";
import { generateControllerEventName } from "../config";
import {
  directive,
  getDirectiveAttr,
  getDirectiveData,
  setDirectiveData,
} from "../directive";
import { getScopedPropertyFromElement } from "../evaluator";
import { GL_STORE_UPDATED_EVENT } from "../namings";

const RegisteredPlugins = new Map();

export function createPluginDirectiveFunction(directiveName, callback) {
  const generatedDirectiveFunction = (el, Controller) => {
    // Pass down the directive data and include util functions for plugins
    callback(el, Controller, {
      getScopedPropertyFromElement,
      generateControllerEventName,
      removeGLElement,
    });
  };

  directive(directiveName, generatedDirectiveFunction);
}

export function registerPlugin(
  { name: pluginName, author: pluginAuthor },
  callback
) {
  if (RegisteredPlugins.get(pluginName)) {
    console.error(
      `[GreenLight] Plugin with name ${pluginName} is already registered.`
    );

    return;
  }

  const PluginObject = {
    name: pluginName,
    author: pluginAuthor,
    getScopedPropertyFromElement,
    generateControllerEventName,
    removeGLElement,

    directive: {
      register: directive,
      getAttribute: getDirectiveAttr,
      getData: getDirectiveData,
      setData: setDirectiveData,
    },

    namings: {
      GL_STORE_UPDATED_EVENT,
    },
  };

  RegisteredPlugins.set(pluginName, PluginObject);

  callback(PluginObject);
}
