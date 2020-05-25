# Webpack

Following this tutorial: <https://www.sitepoint.com/bundle-static-site-webpack/>.

## Initialise project

Initialise a git repo for your project and clone it down.

Create an empty `package.json` file:

```json
{}
```

Run `yarn add --dev webpack webpack-cli` to install webpack locally and add it as a dev dependency to your `package.json`.

You should add `main`, `license` and `scripts` to the `package.json` object. Your scripts object should contain the commands for `build` and `watch` using webpack. At this point your `package.json` should look like:

```json
{
  "main": "webpack.config.js",
  "license": "MIT",
  "scripts": {
    "build": "webpack --config webpack.prod.js",
    "watch": "webpack --watch --progress --colors --config webpack.dev.js"
  },
  "dependencies": {},
  "devDependencies": {
    "webpack": "^4.43.0",
    "webpack-cli": "^3.3.11"
  }
}
```

You should create the file structure for your project.

TODO: Link to the webpack-filestructure note in Trilium.

We will create `./src/js` and `./src/scss` folders. We create a `./dist` folder for webpacks output and we create a `./static` folder for anything that needs to be outside the bundle.

Inside `./src/js` we will create an `App.js`. Inside `./src` we will create a `main.js`.

At this point your `./src` directory should look like:

```text
./src
├── js
│  └── App.js
├── main.js
└── scss
```

You should create your webpack config files: <https://webpack.js.org/guides/production/>.

Create `webpack.common.js` and `webpack.prod.js` in the root of your project next to your `package.json`.

### webpack.common.js

This file is for code common between environments.

This file should contain:

| Package              | Command                         | Description                               |
| -------------------- | ------------------------------- | ----------------------------------------- |
| `CleanWebpackPlugin` | `yarn add clean-webpack-plugin` | Empties folders after each webpack build. |

A bare basic config should look like:

```javascript
const webpack = require("webpack");
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: path.resolve(__dirname, "src/main.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: ["dist/*"],
    }),
  ],
};
```

#### extras

| Package                 | Command                                               | Description                                                                                                                                                                                                                                 |
| ----------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AssetsPlugin`          | `yarn add assets-webpack-plugin`                      | Exports a `json` file containing a mapping for dynamically importing webpack outputs into `HTML`.|
| `webpack.ProvidePlugin` | `yarn add` the plugin you want to provide.            | This functionality of webpack will make a library available everywhere in your javascript, without you having to import them individually in each file. Use this if you need a library available across multiple files.                     |
| `babel-loader`          | `yarn add babel-loader @babel/core @babel/preset-env` | Babel will transform ES javascript into browser compatible javascript. We use `babel-loader` as a `module` in `webpack` module. We transform any `.mjs` files that will be resolved when we import a library and we exclude `node_modules`. |

The final `module.exports` looks like:

```javascript
module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: path.resolve(__dirname, "src/main.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: ["dist/*"],
    }),
    new AssetsPlugin({
      filename: "assets.json",
      path: path.resolve(__dirname, "data/panaetius-theme"),
      prettyPrint: true,
      fullPath: false,
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jquery: "jquery",
    }),
  ],
};
```

### webpack.prod.js

This file is for production builds.

| Package         | Command                  | Description                                     |
| --------------- | ------------------------ | ----------------------------------------------- |
| `webpack-merge` | `yarn add webpack-merge` | Merge webpack configs for common, dev and prod. |

A bare basic config should look like:

```javascript
const webpack = require("webpack");
const common = require("./webpack.common");
const merge = require("webpack-merge");

module.exports = merge(common, {
  mode: "production",
  devtool: "none",
  output: {
    filename: "[name].[contenthash].min.js",
    chunkFilename: "[id].[name].[contenthash].min.js",
    publicPath: "dist/",
  },
});
```

The output files are using dynamic naming in `webpack`. We include the `contenthash` in the files to assist with caching. If you don't want to use dynamic importing, you can take this out for semi-static naming. Alternatively, use optimization settings to only output 1 `css` and `js` file - but for large files this will be unoptimal.
