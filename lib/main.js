import { init } from "./lifecycle";

// Controllers
import { getRegisteredController } from "./controller/register";

// Adding all the directives
import "./directives";

const GreenLight = {
  version: "0.0.1",
  init,
  controller: getRegisteredController,
};

window.GreenLight = GreenLight;

export default GreenLight;
