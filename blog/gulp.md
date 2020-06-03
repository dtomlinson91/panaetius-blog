# Gulp

Gulp can complement webpack by adding additional workflows to your project. Webpack can be used to package your bundles, gulp can be used to run additional things before or after the build.

<https://forestry.io/blog/gulp-and-webpack-best-of-both-worlds/>

Using node we could run our webpack command and build commands seperately in the workflow. We could use gulp to use one command to do both. We can also use gulp to build the search index of an app as part of this workflow.

## ES6 in Gulp

Gulp is a command-line task runner for node. This means that any javascript that is valid in node is valid in gulp (including anything you import). Node doesn't support ES6 modules (without using babel) so you have to use `require` and `exports`. You can freely use arrow functions and any other node compatible javascript.

<https://gulpjs.com/docs/en/getting-started/javascript-and-gulpfiles/>

If you want full ES6 syntax in gulp you should create a `gulpfile.babel.js` and install the `@babel/register` module.

If you just want the `import/export` syntax create a `gulpfile.esm.js` and install the `esm` module.

## Creating a gulpfile

`yarn add gulp`

Create a `gulpfile.js` in the root of your project next to the `package.json` file.

Alternatively if you want to split your gulp tasks out into seperate modules you should create a `./gulpfile.js` directory and an `index.js` file inside. This will be treat as a normal `gulpfile.js`.

### functions

Create functions as normal in the gulpfile. These functions should take `cb` as a parameter and you should end the function with `cb()` to let gulp know the function has finished.

### export

Your gulpfile should export either a `gulp.series` or `gulp.parallel` (or just the function itself). `series` will run one after the other and parallel will run in any order.

An example gulpfile that is importing a module and running it:

```javascript
const { run } = require("./build-lunrjs-index");
const gulp = require("gulp");

function buildSearch(cb) {
  run();
  cb();
}

module.exports = {
  buildSearch: gulp.parallel(buildSearch),
};
```

## package.json

Your `package.json` file can create an entry under the `scripts` key:

```json
"scripts": {
"buildSearch": "gulp buildSearch"
}
```

The `gulp` command should be followed by the name of the export you want to run.

You can then run the command using `npm` or `yarn`: `yarn buildSearch`.

## webpack

You can integrate gulp with webpack, allowing gulp to run your webpack build. There are a few ways to do this, one way using `webpack-stream` is here: <https://cecilphillip.com/adding-webpack-to-your-gulp-tasks/>.

Alternatively, if you don't want to control webpack through gulp (pipe in a different destination or alter the workflow) and just want to run it as if you were running webpack directly you can simply import `webpack` and your `webpack.prod.js` file into gulp.

The following gulpfile will run a webpack build (remember to add to package.json as a script):

```javascript
const webpack = require("webpack");
const webpackConfig = require("./webpack.prod");

function buildTheme(cb) {
  return new Promise((resolve, reject) => {
    webpack(webpackConfig, (err, stats) => {
      if (err) {
        return reject(err);
      }
      if (stats.hasErrors()) {
        return reject(new Error(stats.compilation.errors.join("\n")));
      }
      resolve();
    });
  });
}

module.exports = {
  buildTheme: buildTheme,
};
```
