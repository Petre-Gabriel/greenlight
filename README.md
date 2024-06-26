[![CircleCI](https://dl.circleci.com/status-badge/img/circleci/D4bACYgELziWRdvGQX58ng/DbxnmyVKxzouDZg5RnK6N7/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/circleci/D4bACYgELziWRdvGQX58ng/DbxnmyVKxzouDZg5RnK6N7/tree/main)

# GreenLight.js

A minimal JavaScript framework for boosting production on small-scale web projects.

# What does it do?

GreenLight offers a varierty of directives to control and react to the changes with as little effort as possible. All you have to do is declare your structure in HTML and handle the events with JavaScript. Out-of-the-box support for stores, data binding, memoization and error-handling.

## Let us handle the data changes in your project

Stop worrying about what changes and where. Focus on how to utilize the data changed in your advantage. One of the main features of GreenLight is the reactivity behind it on each component state change.

## Let's see an example

We setup a form that binds the inputs to our local controller store.

```html
<form gl-controller="loginForm">
  <input type="text" placeholder="Username" gl-bind="username" />
  <input type="password" placeholder="Password" gl-bind="password" />
  <button type="submit" gl-on="submit:loginFormSubmit">Login</button>
</form>
```

We get the form controller and add an event called `loginFormSubmit` as we setup in the HTML. Here, we only log the username and password in the console but the possibilities are endless.

```js
const LoginFormController = GreenLight.controller("loginForm");

LoginFormController.on("loginFormSubmit", (e) => {
  const FormState = LoginFormController.$store.get();

  console.log(FormState.username, FormState.password);
});
```

## Why?

This library started as a need and want to combine AlpineJS and AngularJS and get the best out of both worlds -> JS behavior in markup with extended support for writing scripts, templates and handling logic outside of HTML.

## Getting started

You can add the script tag into your website and start with only one command:

```js
GreenLight.init(appRoot);
```

With this command, GreenLight will hook on to the element provided and will attach itself to each element with a directive. Here is an example:

```html
<html>
  <body>
    <div id="app-root">
      <div gl-controller="GettingStarted">
        <div gl-bind="myText"></div>
      </div>
    </div>
    <script src="greenlight.min.js"></script>

    <script>
      const appRoot = document.getElementById("app-root");

      GreenLight.init(appRoot);
      GreenLight.$store.set("myText", "Getting started");
    </script>
  </body>
</html>
```
