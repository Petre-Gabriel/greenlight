import { computeElement } from "./interpretor";
import { processControllers } from "./processor";

export function init(root) {
  if (!document || !window)
    throw new Error("You must use the GreenLight library in a browser");

  if (!root)
    throw new Error("You must provide a valid root for GreenLight to hook on.");

  processControllers(root, computeElement);
}
