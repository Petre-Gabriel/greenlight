import { GL_VERSION } from "./config";
import { init } from "./lifecycle";

// Controllers
import { getRegisteredControllerByName } from "./controller/register";

// Adding all the directives
import "./directives";
import { registerPlugin } from "./plugins";

/**
 * TODO: Create a global store for directives to access.
 * TODO: Create a function that returns a store value based on the context ( local store has priority )
 */
const GreenLight = {
  version: GL_VERSION,
  init,
  controller: getRegisteredControllerByName,
  registerPlugin,
};

window.GreenLight = GreenLight;

export default GreenLight;
