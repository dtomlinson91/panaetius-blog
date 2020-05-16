## Webpack

Great tutorial for the basics: <https://www.sitepoint.com/bundle-static-site-webpack/>.

We can use webpack to bundle up our resources (javascript files or css files) and create a minified bundle for a website.

You can bundle anything up, we can even write `scss` and have webpack lint, compile and minify into the `dist` directory for us automatically.

### Structure

#### Folder structure

The structure can depend on the project. If you are using webpack you can create `./src` folder where you can place `./src/js` or `./src/scss` for example. We can have a `./node_modules` folder then use webpack to compile.

You can use a layout suggestion as given here: <https://medium.com/@nmayurashok/file-and-folder-structure-for-web-development-8c5c83810a5> for inside the `./src` folder.

#### Files location

Raw files go in `./src` or at the root level. See the folder structure on how to name folders.

Any bundled/compiled files which will be used by the website itself should go in `./dist` or `./static/dist`.

### Build patterns/ code organisation

#### SCSS/CSS

Any scss/css you want to use should go in your raw folder.

You should have a `_variables.scss` which should define and/or overwrite any variables from any frameworks you are importing (bootstrap).

You can then have as many `scss` files as needed for your content. You can split them by page, or by component etc.

Finally you should have a `styles.scss`. This file should import all the `scss` files you've created, in addition to any provided by third party packages. Remember to import the `_variables.scss` file first and any other `scss` files that are overwriting something else.

TODO: Link to the example `styles.scss` in git.

With `scss`, imports are done with the `@import "";` syntax. You leave out the extension if it's `.scss`, otherwise provide it if it's `css`.

If you want to reference a file in `node_modules` you can use the `~` as a shortcut to that path. E.g `@import "~bootstrap/scss/bootstrap";`.

#### Javascript

You should use asynchronous imports to improve performance in your `.js` files.

We create two files: `App.js` and `main.js`.

##### App.js

This file should go in `./src/js`. It should contain all the javascript configuration needed for your app. E.g if using font-awesome's javascript loader and library functionality you should import them and add them here.

TODO: Link to the example `App.js` file in git.

We go through some common options for a project (in Hugo) here.

### Config

`output.path` is where the bundles files will go
is `output.publicPath` the path you will reference in the `html`. Here is a webpack wiki explanation: <https://github.com/webpack/docs/wiki/configuration#outputpublicpath>.

### Use npm to install bower dependencies

As `bower` is deprecated in favour of `yarn` and `webpack`, most packages now come with `npm`.`yarn`.

You can use `npm` to install bower dependencies if they are old and haven't been updated for `npm`.

#### Change bower installation path

You should change the installation path for `bower` from `bower_modules` to `node_modules`.

To do this create a `.bowerrc` file in the root of your repo that contains the following:

```json
{
  "directory" : "node_modules"
}
```

#### Allow npm to run bower install

You can use an `npm` script to run `bower install` which will install your bower dependencies whenever you do `npm install`.

Edit the `scripts` in your `package.json` to add the following:

```json
"scripts": {
  "postinstall": "bower install"
}
```
