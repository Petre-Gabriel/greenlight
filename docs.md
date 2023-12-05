
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
const TodoController = GreenLight.controller('TodoController');

// With this you can retreieve the store.
// What we did down here will trigger the gl-for to render the elements below.
TodoController.$store.get().items = ['Do', 'Anything'];
```

# gl-bind
`gl-bind` allows you to connect your JS store with the HTML.

The functionality of this directive depends on the type of element it is attached to. For example, if you have an input like the one below.
```html
<input gl-bind="username" placeholder="username" />
``` 
It will not only update the value of the input, but also it will update the store value that you can retrieve with JavaScript.
```js
Controller.$store.get().username // This gets updated when the input does
```

But, for example, you want to bind the value to a `p` element. Here is how you do it:
```html
<p gl-bind="username"></p>
```
Now, everytime the username changes, it will update the `p` element.
**NOTE**: It doesn't not accept any HTML and will treat it as a plain text because it is  not safe to pass plain markup to the DOM.

## Scope
By default, GreenLight tries to fetch the closest store to your element. It can be a `controller` or an element with directive data set, for example - the `gl-for` directive sets the closest data for each element rendered with it. If the variable set in the `gl-bind` directive is not available in the for loop, it will search for it in the controller store.


# gl-on
`gl-on` helps you react to disptached DOM events.

Here is an example on how to react to form submits.
```html
<form gl-on="submit:onLogin">
	<input type="email" gl-bind="email" />
	<input type="password" gl-bind="password" />
	<button type="submit">Login</button>
</form>
```

```js
MyController.on('onLogin', e => {
	e.preventDefault(); // So it doesn't refresh the page
	
	const email = MyController.$store.get().email;
	const password = MyController.$store.get().password;

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
Controller.on('onButtonClick', () => alert('clicked it!'));
```


# gl-if
With this directive you can conditionally show/hide an element based on the value of the variable passed.

It is important to know that it doesn't remove and add the whole element back to the DOM, it only applies and removes the `display: none` attribute.

```html
<div x-if="isLogged">
	<p>
		Welcome back, <b g-bind="username"></b>
	</p>
</div>
```

## False values

It is recommended to use only *booleans* when dealing with `gl-if` to avoid any type of confusion. Internally, GreenLight doesn't verify for `true` or `false` values only but it is best practice to provide to the directive only *boolean* values. 

```html
<div gl-if="isOnline"><div>
```
The code above is the same as running the following JavaScript
```js
if(!isOnline)
```

So, you can pass a variable that is `null` but it will also take it as a false value. So, based on what you want to achieve it is good to keep in mind that it doesn't only check if it's true or false.
