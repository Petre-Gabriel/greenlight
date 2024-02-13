import { removeGLElement } from "../cleanup";
import { generateControllerEventName } from "../config";
import { directive, getDirectiveData, setDirectiveData } from "../directive";
import {
  evaluateExpressionForElement,
  getScopedPropertyFromElement,
} from "../evaluator";
import { GL_STORE_UPDATED_EVENT } from "../namings";

const RegisteredPlugins = new Map();

export function registerPlugin(pluginName, callback) {
  if (RegisteredPlugins.get(pluginName)) {
    console.error(
      `[GreenLight] Plugin with name ${pluginName} is already registered.`
    );

    return;
  }

  const PluginObject = {
    name: pluginName,
    evaluateExpressionForElement,
    getScopedPropertyFromElement,
    generateControllerEventName,
    removeGLElement,

    directive: {
      register: directive,
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
