/**
 * 1. What can plugins get?
 * Directive register function + directive data set/get
 * Global store
 * Scoped properties from elements
 * Namings for GL internal events
 * Controller generate and call events.
 * Cleanup functions
 * 2. What can a plugin affect?
 * Any GL element.
 * Global and Controller stores.
 * 3. How to use?
 * Register plugins before GL init and that's it
 */

import { registerPlugin } from "./register";

export { registerPlugin };
