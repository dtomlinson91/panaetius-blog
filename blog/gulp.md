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

## promises in gulp functions

Gulp functions must take `cb` as a parameter and end with `cb()` to let gulp know the task has finished.

Alternatively you can use an `async` function and have your function `await` a promise at the end.

**If your function ends with a promise you do not need to use `cb()`**.

## webpack

### webpack api

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

### using exec

TODO: Link this to javascript running commands/executing files.

If you wanted to run a webpack build in another node project (say a theme which is a submodule), you can use `exec` to literally run the webpack command from the folder as if you were doing it on the shell.

```javascript
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const themeDir = getCurrentDir(__dirname) + "/themes/panaetius-theme";

function getCurrentDir(dir) {
  var themeDir = dir.split("/");
  themeDir.pop();
  return themeDir.join("/");
}

// Function to build the theme
async function buildTheme(cb) {
  console.log(themeDir);
  await exec(
    `cd ${themeDir} && node ${themeDir}/node_modules/webpack/bin/webpack.js --config ${themeDir}/webpack.prod.js`
  );
}
```

Here we are getting the current full path to the file being ran (the gulpfile) and stripping the filename to get the path.

We then use `exec`, which has been wrapped in a promise, to `cd` into the project directory and run the node command to build webpack.

## minimizing images

<https://gulpjs.com/docs/en/getting-started/working-with-files>

Use the plugin `gulp-imagemin`: `yarn add gulp-imagemin`

You should use `src()` and `dest()` using `pipe()` to load in your images.

`src` should be an array of images (you can use globs). You then pipe into an instance of `imagemin()`.

To overwrite the file, you should use `file.base` in a function:

```javascript
function minifyImages(cb) {
  gulp
    .src([
      `${currentDir}/content/**/*.png`,
      `${currentDir}/content/**/*.svg`,
      `${currentDir}/static/**/*.png`,
      `${currentDir}/static/**/*.svg`,
      `${themeDir}/static/**/*.png`,
      `${themeDir}/static/**/*.svg`,
    ])
    .pipe(imagemin())
    .pipe(
      gulp.dest(function (file) {
        return file.base;
      })
    );
  cb();
}
```

## minimizing javascript

Some javascript won't be suitable for inclusion in a bundle (`lunr`). You can include these in your final build by copying the file from `node_modules` into `./static/dist` and minimize the file using gulp.

Use `yarn add gulp-minify`.

```javascript
const minify = require("gulp-minify")

function lunr(cb) {
  gulp
    .src(`${currentDir}/node_modules/lunr/lunr.js`)
    .pipe(minify())
    .pipe(gulp.dest(`${currentDir}/static/dist`));
  cb();
}
```

## inserting webpack dynamic bundle content into a file

<https://stackoverflow.com/questions/23247642/modify-file-in-place-same-dest-using-gulp-js-and-a-globbing-pattern>

Use <https://www.npmjs.com/package/gulp-replace> to replace a string in a file.

Approach:
If you are not using Hugo, you could use the above to dynamically reference images in your html.

Use gulp to replace these references with the images bundled with webpack. If yuo name the images the same as they're referenced, then replace any `<img src="">` with the bundled image in the html.

You can get the mapping from the output from webpack, using the unique image name as the key. You can then use gulp to minimise or resize the images.

## Hugo

TODO: Link this to javascript running commands/executing files.

You can build a Hugo project in Gulp by using `execFile`.

```javascript
const util = require("util");
const exec = util.promisify(require("child_process").execFile);

async function buildHugo(cb) {
  await execFile("hugo", ["-D", "--minify"]);
}
```
