# gl-controller

This is the base of any GreenLight application as it defines the start of a feature on your website.

It also initializes a reactive store for the controller and its children.

Here is an example

```html
<div gl-controller="TodoController">
  <ul>
    <template x-for="(item,idx) in items">
      <li>
        #<span gl-bind="idx"></span>
        <p gl-bind="item"></p>
      </li>
    </template>
  </ul>
</div>
```

With this, you can now use all the data declare in HTML with JavaScript.

```js
const TodoController = GreenLight.controller("TodoController");

// With this you can retreieve the store.
// What we did down here will trigger the gl-for to render the elements below.
TodoController.$store.set("items", ["Do", "Anything"]);
```

# gl-bind

`gl-bind` allows you to connect your JS store with the HTML.

The functionality of this directive depends on the type of element it is attached to. For example, if you have an input like the one below.

```html
<input gl-bind="username" placeholder="username" />
```

It will not only update the value of the input, but also it will update the store value that you can retrieve with JavaScript.

```js
Controller.$store.get("username"); // This gets updated when the input does
```

But, for example, you want to bind the value to a `p` element. Here is how you do it:

```html
<p gl-bind="username"></p>
```

Now, every time the username changes, it will update the `p` element.
**NOTE**: It doesn't not accept any HTML and will treat it as a plain text because it is not safe to pass plain markup to the DOM.

## Bind to other properties

You are not restricted to only binding to the text content or value of an element. You can bind to anything you like:

```html
<p gl-bind:id="username"></p>
```

The code above will bind the `username` variable to the ID of the element.

You can pass as many bind points as you like, you just need to specify them on the element:

```html
<p gl-bind:id="username" gl-bind:text="welcomeBackMessage"></p>
```

With this, the ID will be equal to the `username` variable and the text content will be equal to the `welcomeBackMessage` variable.

_NOTE_: You don't have to specify the binding point if you only need the default behaviour - if it's an input, bind the value, else bind the text content.

**IMPORTANT**: If you are binding to properties other than the defaults one, you might need some counter measures to prevent XSS and other similar attacks because GreenLight doesn't prevent them.

## Scope

By default, GreenLight tries to fetch the closest store to your element. It can be a `controller` or an element with directive data set, for example - the `gl-for` directive sets the closest data for each element rendered with it. If the variable set in the `gl-bind` directive is not available in the for loop, it will search for it in the controller store.

To access global variables, you can use the `$` symbol to notify GreenLight that you want to fetch the Global Store.

```js
GreenLight.$globalStore.set("appName", "Test App");
```

```html
<p gl-bind="$appName"></p>
```

# gl-on

`gl-on` helps you react to dispatched DOM events.

Here is an example on how to react to form submits.

```html
<form gl-on="submit:onLogin">
  <input type="email" gl-bind="email" />
  <input type="password" gl-bind="password" />
  <button type="submit">Login</button>
</form>
```

```js
MyController.on("onLogin", (e) => {
  e.preventDefault(); // So it doesn't refresh the page

  const email = MyController.$store.get("email");
  const password = MyController.$store.get("password");

  console.log(`Your email is ${email} and your password is ${password}.`);
});
```

## Syntax

To use `gl-on` you need 2 things: a DOM event and an event name for your controller to call. They will be separated by a `:`. Here is an example.

```html
<button gl-on="click:onButtonClick"></button>
```

So when the button fires a `click` event, the controller will call the listeners for `onButtonClick`.

```js
// The function provided will be executed every time the button is clicked
Controller.on("onButtonClick", () => alert("clicked it!"));
```

# gl-if

With this directive you can conditionally show/hide an element based on the value of the variable passed.

It is important to know that it doesn't remove and add the whole element back to the DOM, it only applies and removes the `display: none` attribute.

```html
<div x-if="isLogged">
  <p>Welcome back, <b g-bind="username"></b></p>
</div>
```

## False values

It is recommended to use only _booleans_ when dealing with `gl-if` to avoid any type of confusion. Internally, GreenLight doesn't verify for `true` or `false` values only but it is best practice to provide to the directive only _boolean_ values.

```html
<div gl-if="isOnline"><div></div></div>
```

The code above is the same as running the following JavaScript

```js
if(!isOnline)
```

So, you can pass a variable that is `null` but it will also take it as a false value. So, based on what you want to achieve it is good to keep in mind that it doesn't only check if it's true or false.

# gl-hook

`gl-hook` helps you hook onto changes on any variable and respond accordingly to them in your HTML.

Here is a basic example:

```html
<div gl-hook="username:onUsernameChange"></div>
<input gl-bind="username" />
```

```js
Controller.on("onUsernameChange", ([username]) => {
  if (username.length < 4) return "Your name should have at least 4 characters";

  return;
});
```

Now, if the username is below 4 characters, it will change the `div` content with the returned value from the event handler.

It's a good practice to return nothing after all the checks to ensure that the div will no longer show.

# gl-for

`gl-for` is used to iterate over a list and render DOM elements. Here is a simple example:

```js
// We initialize a simple list.
Controller.$store.set("todos", ["Do this", "Do that"]);
```

In the HTML, we are going to iterate over the `todos` list and print the index and the content.

```html
<ul>
  <template gl-for="(todo,idx) in todos">
    <li>
      #<span gl-bind="idx"></span>
      <span gl-bind="todo"></span>
    </li>
  </template>
</ul>
```

## Performance

`gl-for` is a key directive because it's widely used across all web applications. It needs to be fast and reliable.

GreenLight implements a variant of the Alpine.JS `x-for` that only re-renders new elements from the Array. Also, every element has an assigned key that tracks whether it should change or not.

# gl-template

Sometimes, it's ugly to just create new elements to bind a custom message. This is why we created `gl-template`. You pass your template as following:

```html
<div gl-template="Welcome back, {username}!"></div>
```

GreenLight will replace the `{username}` with the actual value from the store. If no variable was found, it will replace it with an empty string. Can be used with `gl-if`.

## Bind to other properties

It's important to be flexible when working with binding data, so you can pass additional parameters to tell GreenLight where it should bind the data received.

```html
<p gl-template:id="{username}" gl-template="Hello, {username}"></p>
```

The default value if you don't provide the addition is `default` or `text`. They both do the exact same thing, so you don't need to specify the binding point if you only need the simple behaviour explained above.

**IMPORTANT**: If you are binding to properties other than the defaults one, you might need some counter measures to prevent XSS and other similar attacks because GreenLight doesn't prevent them.

## Security

As always, we take into consideration the security of your application. It doesn't just replace it with the variable name. It creates a Text node so you can't just put for example, a script tag that will run.

# gl-ref

This directive is used to create an internal reference to any element in your controller and access the DOM element.

```html
<div gl-ref="anything"></div>
```

So, we create a reference called `anything` and we will fetch it in the following JS code:

```js
Controller.$refs.get("anything").innerHTML = "Test";
```

After this, the `innerHTML` of the element will be set to `Test`. Keep in mind that the returned value of `$refs.get` return a plain DOM element with no added properties from GreenLight.

# Controller Effect

Each controller has an `effect` method to react to dependencies changes. Here is an example:

```js
const MyController = GreenLight.controller("SearchForm");

MyController.effect(() => {
  // This code will run when searchInput or searchFilter changes.
}, ["searchInput", "searchFilter"]);
```

If multiple variables from the dependencies array change at the same time, the effect will run only once.

```js
MyController.$store.set(searchInput, "apples");
MyController.$store.set(searchFilter, "color=red");
```

If you run the code above, the effect will be triggered once. That is because internally, GreenLight uses a strategy called `debounce` to wait for new changes. It waits for a few milliseconds before the final call so if there are multiple changes to the dependency array it will only call it once.

# Global store

If you want to pass data between multiple controllers, you can use the GreenLight store that was created on the `init` phase. To access it, you can use the following:

```js
GreenLight.$globalStore.get();
```

## Detect changes

Also, you can react to changes on the global store by using the `onChange` method provided:

```js
GreenLight.$globalStore.onChange((keyChanged) => {
  // Here you put the code you want to execute on change.
});
```

## Store effects

This is similar to the `onChange` method but it only reacts to changes on variables passed in the dependencies array. Here is an example:

```js
GreenLight.$globalStore.effect(() => {
  // This will run only if the isUserConnected variable changed.
}, ["isUserConnected"]);
```

### How it works internally

As of any `effect` in this library, it utilizes a `debounce` strategy to batch changes together and only call the effect once if multiple variables have changed at once.

# Plugins

The base of GreenLight is supposed to contain only general utilities that fit every situation. This ensures that the library will have a small footprint on your web page.

If you are in need of a more specific solution for your problem you can fetch the internet for a plugin or create it yourself.

They are made for ease of use - to include a plugin you only need to import the script in your page.

Everything you need to get going with the development of a plugin is included in the GitHub repository - from dev docs, to examples and real world codebases of plugins.
