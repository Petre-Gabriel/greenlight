# Plugins

Their are an addition to the small set of functionalities provided by GreenLight.

You can create one very easy as you are being provided with all properties and methods needed to extend the functionality.

## Getting started

All you have to do is use the `registerPlugin` method provided by the GreenLight object before the `init` phase.

```js
GreenLight.registerPlugin(pluginName, (PluginObject) => {
  const { directive } = PluginObject;
  // With the code below we register the gl-log directive
  directive.register("log", (el, Controller) => {
    console.log(el);
  });
});
```

### API info

`pluginName: String` Name of the plugin

**PluginObject**

`name: String` The name of the plugin specified.
`getScopedPropertyFromElement(element: HTMLElement, property: String)` Get object from directive attribute, local store and global store based on the scope.
`evaluateExpressionForElement(element: HTMLElement, expression: String)` Evaluate expression provided in the params
`generateControllerEventName(controllerName: String, eventName: String)` Generates controller event name with the GreenLight format. If you are using the Controller `callEvent` it is called automatically, you only need to provide the eventName.
`removeGLElement(el: HTMLElement, controllerName: String)` Remove and do cleanup on
`directive` Object with all the necessary methods to work with directives.
`namings` Object with important namings - GL_STORE_UPDATED_EVENT

**directive**
`register(name: String, callback(el: HTMLElement, Controller: GLController))` Register a new directive.
`getAttribute(directiveName: String, el: HTMLElement` Get the directive attribute.
`getData(el: HTMLElement)` get the data object set by directives.
`setData(el: HTMLElement, data: any)` set the data object

**Controller**
`name: String` Name of the controller
`attachedTo: HTMLElement` The element that contains the `gl-controller` directive
`$store` The store object assigned to the controller
`$refs` The references object attached to the controller
`effect(callback: Function, depsArray: String[])` The effect method
`on(eventName: String, callback: Function)` Used to listen to events from the controller
`callEvent(eventName: String, data: any)` Used to call events on the Controller and it's children.
