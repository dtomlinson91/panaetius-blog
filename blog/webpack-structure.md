# Webpack

Following this tutorial: <https://www.sitepoint.com/bundle-static-site-webpack/>.

## Initialise project

Initialise a git repo for your project and clone it down.

Create an empty `package.json` file:

```json
{}
```

Run `yarn add --dev webpack webpack-cli` to install webpack locally and add it as a dev dependency to your `package.json`.

You should add `main`, `license` and `scripts` to the `package.json` object. At this point your `package.json` should look like:

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
