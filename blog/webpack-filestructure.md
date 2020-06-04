# Webpack

TODO: This note should also go under a note for structuring a website.s

Great tutorial for the basics: <https://www.sitepoint.com/bundle-static-site-webpack/>.

We can use webpack to bundle up our resources (javascript files or css files) and create a minified bundle for a website.

You can bundle anything up, we can even write `scss` and have webpack lint, compile and minify into the `dist` directory for us automatically.

## Structure

Overview:

- When adding a new `scss` library add it to the `styles.scss` file using `@import`.
- When adding a new `js` library add it to the `main.js` library using `import`.
- You can split out your imports into subfiles, remember to import that file into the two files above.

### Folder structure

The structure can depend on the project. If you are using webpack you can create `./src` folder where you can place `./src/js` or `./src/scss` for example. We can have a `./node_modules` folder then use webpack to compile.

Images/content to be bundled by webpack (used in the css) go in `./src`.

You can use a layout suggestion as given here: <https://medium.com/@nmayurashok/file-and-folder-structure-for-web-development-8c5c83810a5> for inside the `./src` folder.

### Files location

Raw files go in `./src` or at the root level. See the folder structure on how to name folders.

Any bundled/compiled files which will be used by the website itself should go in `./dist` or `./static/dist`. You can also place content that goes outside the bundle (extra images not referenced in css) in `./static/images`.

## Build patterns/ code organisation

### SCSS/CSS

Any scss/css you want to use should go in your `./src/scss` folder (or wherever else it is going).

You should have a `_variables.scss` which should define and/or overwrite any variables from any frameworks you are importing (bootstrap).

You can then have as many `scss` files as needed for your content. You can split them by page, or by component etc.

Finally you should have a `styles.scss`. This file should import all the `scss` files you've created, in addition to any provided by third party packages. Remember to import the `_variables.scss` file first and any other `scss` files that are needing to be overwritten by these variables afterwards.

TODO: Link to the example `styles.scss` in git.

With `scss`, imports are done with the `@import "";` syntax. You leave out the extension if it's `.scss`, otherwise provide it if it's `css`.

If you want to reference a file in `node_modules` you can use the `~` as a shortcut to that path. E.g `@import "~bootstrap/scss/bootstrap";`.

```scss
@import "_variables";
@import "~bootstrap/scss/bootstrap";
@import "~ekko-lightbox/dist/ekko-lightbox.css";
```

### Javascript

You should use asynchronous imports to improve performance in your `.js` files.

We create two files: `App.js` and `main.js`.

#### App.js

TODO: Link to the `App.js` file in git

This file should go in `./src/js`. It should contain all the javascript configuration needed for your app. You can split this file out if it gets too large, we will use `main.js` to import everything in at the end.

You should firstly instantiate any classes/modules you need. For example you can import and create the font-awesome library, adding the icons you need.

Secondly, you should `export default{}` and create key:value pairs. These values should be callback functions (arrow functions) that return the javascript needed for that partiuclar task. We go through some of these below.

The purpose of `App.js` is:

- Any javascript that you need across your whole project.

For example if we are using Font Awesome, we will need to import it and run the javascript needed (`dom` and `library`).

- Manipulating the dom (with JQuery).

If we are using Hugo's markdown, it won't apply any classes to a table for stying with bootstrap. We can craete a function that adds bootstrap classes to certain tags, filling in what Hugo doesn't support:

```javascript
export default {
  bootstrapify: () => {
    $('.content blockquote').addClass('blockquote');
    $('.content table').addClass('table');
    $('.content table').wrap('<div class="table-responsive" />');
    $('.content table thead').addClass('thead-dark');
    $('.content pre').wrap('<figure class="highlight" />');
    $('.content figure > img').addClass('img-fluid');
  }
```

We can use Jquery's `addClass` and `wrap` methods to manipulate the HTML that Hugo produces.

Here we are using webpack's plugins to provide jquery across everything without having to import it every time. See the webpack notes for more on what it does.

Another example of this is writing a `navbarFade` function. This will hide the navbar if we scroll past a certain point:

```javascript
navbarFade: () => {
  let $position = $(window).scrollTop();

  $(window).scroll(() => {
    const $scroll = $(window).scrollTop();
    const $navbarHeight = $("#navbar-main-menu.fixed-top").outerHeight();

    $scroll > $position
      ? $("#navbar-main-menu.fixed-top").css("top", -$navbarHeight)
      : $("#navbar-main-menu.fixed-top").css("top", 0);

    if ($scroll <= 0) {
      $("#navbar-main-menu.fixed-top").css("top", 0);
    }

    $position = $scroll;
  });
},
```

This callback function, like all the others, will be called in the `main.js` file later and be available site-wide.

- Adding lazyload

We can use lazyload (provided by `vanilla-lazyload`). To do this, we should create an arrow function that asynchronously imports `vanilla-lazyload` and intantiates a new `LazyLoad object`:

```javascript
lazyload: async () => {
  const { default: LazyLoad } = await import(/* webpackChunkName: "lazyload" */ 'vanilla-lazyload');
  new LazyLoad({
      thresholds: "40px 10%",
      load_delay: 100,
  });
},
```

Then we can use `data-src=""` in any `<img>` tags to use lazyloading.

- Adding a JQuery library (ekko-lightbox)

Ekko-lightbox <http://ashleydw.github.io/lightbox/> can be used to create a lightbox gallery using bootstrap.

Instructions are to insert some JQuery into your site. So we can use a callback function here to do this:

```javascript
lightbox: async () => {
  const { default: ekkoLightbox } = await import(
    /* webpackChunkName: "ekkoLightbox" */ "ekko-lightbox"
  );
  $('[data-toggle="lightbox"]').click(function (e) {
    e.preventDefault();
    $(this).ekkoLightbox();
  });
},
```

Note that with JQuery:

```javascript
$(document).on('click', '[data-toggle="lightbox"]', function(e) {
```

Is functionally the same as here:

```javascript
$('[data-toggle="lightbox"]').click(function (e) {
```

because `$(document)` will wait for the DOM to be loaded before running it. As we are using a seperate function with an event to do this, we don't need to use `$(document)` and we can just use the normal JQuery syntax.

##### Using a CDN (prism)

It's possible to still use a CDN with webpack. You might want to do this (say when using Hugo) if you want to toggle an option in a config file, and have Hugo insert the prism CDN if present, or return nothing.

It is possible when doing this to also configure the plugin locally in webpack. We can use an `if` in javascript to see if the plugin is active, and if it is return our config, else return nothing.

To insert using a CDN place your `<script>` tags in the footer (at the end of the body) as usual:

```html
{{ if .Site.Params.prismJS.enable }}
<script>
  window.Prism = window.Prism || {};
  window.Prism.manual = true;
</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.17.1/components/prism-core.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.17.1/plugins/autoloader/prism-autoloader.min.js"></script>
{{ end }}
```

We should also add the CSS to the `head.html` as well, since we will be using a CDN for this as well:

```hugo
{{ if .Site.Params.prismJS.enable }}
{{ if .Site.Params.prismJS.theme }}
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.17.1/themes/prism-{{ .Site.Params.prismJS.theme }}.min.css">
{{ else }}
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.17.1/themes/prism.min.css">
{{ end }}
{{ end }}
```

We're following the Prism documentation: <https://prismjs.com/#basic-usage-cdn>.

Because we are setting `Prism` to manual, we will need to call the api manually, this can be done in the `App.js` under a callback function:

```javascript
syntaxHighlight: () => {
  if (!window.Prism) {
    return;
  }

  Prism.highlightAll();

  $("pre:has(> code[class*=language-])").removeAttr("style");

  const element = $("pre:has(> code:not([class*=language-]))");

  element.addClass("language-none");
  $("> code", element).addClass("language-none");
},
```

We are checking to see if the Prism object is available, if not we return nothing and no hightlighting by Prism will be done.

Then we call the `highlightAll` method on the `Prism` object.

Finally, since Hugo applies its own code styling by default which cannot be turned off, we apply some JQuery that removes the Hugo added style.

#### main.js

This should go in the root of `./src`. This will be our entrypoint into our javascript and we split this out for one main reason.

In this file we should import our `styles.scss`:

```javascript
import "./scss/styles.scss";
```

We can also import any third party javascript libraries in here. `App.js` is more useful for verbose configs and custom site js. For simple imports we can place these in `main.js`:

```javascript
import(/* webpackChunkName: "bootstrap" */ "bootstrap");
```

We want to add a `window.addEventListener` that listens for `'DOMContentLoaded'` and then fires an async function. **We only need to do this if we are interacting with the DOM.** If we are using JQuery in our `./src/js` files, then we need to wait for the browser to finish rendering the DOM before interacting with it.

Youtube tutorial explaining this in detail: <https://www.youtube.com/watch?v=m1DH8ljCqzo>.

We might need to do this with JQuery, or even FontAwesome which has a `dom.watch()` method.

Inside this function, we should import the `App` javascript file containing all our javascript:

```javascript
const { default: App } = await import(/* webpackChunkName: "app" */ "./js/App");
```

We are using `import` asynchronously to import the javascript file. We don't need the extension `.js` just like in `.scss` files.

We are setting this to a const `App`. We need to import the object `default` as that is what is exported in `App.js`.

Then, we can call each callback function in the `default` object which is accessible under the variable `App`:

```javascript
window.addEventListener("DOMContentLoaded", async (event) => {
  const { default: App } = await import(
    /* webpackChunkName: "app" */ "./js/App"
  );

  App.loadFontAwesome();
  App.bootstrapify();
  App.lazyload();
  App.navbarFade();
  App.lightbox();
  App.syntaxHighlight();
});
```
