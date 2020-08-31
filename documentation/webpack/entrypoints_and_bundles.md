Entrypoints are `js` files that are ran when the page is loaded.

## Links

Good information on importing vendor bundles: <https://stackoverflow.com/questions/28969861/managing-jquery-plugin-dependency-in-webpack>.

## Example

- `webpack.prod.js` - <https://github.com/dtomlinson91/panaetius-theme/blob/develop/webpack/webpack.prod.js>

## Uses

### Running scripts sitewide

If you need to run a script sitewide you can create an entrypint for the `js` file. This is good for:

- Random JS files that need executing on a page.
- CDN files (bootstrap, lunrjs).

Entrypoints are ran when it is inserted into the page.

If you want to import multiple libraries as an entrypoint as vendors you can use a list:

```javascript
  entry: {
    mainGlobal: path.resolve(
        __dirname, "../src/mainGlobal.js"
    ),
    vendors: ["bootstrap"],
  },
```

### Making something importable/available sitewide

If you need to make a file available to the sitewide scope (`window` for example) you should use `expose-loader`.

This is good for modules like jQuery - you can use webpack to deploy it as part of your bundle, and make it available sitewide.

**You should make sure the module loaded with `expose-loader` is actually referenced somewhere in the bundle.**

If you just want to include a library as part of the bundle but not use it inside the bundle (jQuery available sitewide but you don't use it in the bundle), you should add:

```javascript
import(/* webpackChunkName: "jQuery"*/ "jquery");
```

To the `main.js` file.

**Using expose-loader and ProvidePlugin together:** if you are using the both of them, remember that the instance of the one used in `ProvidePlugin` is different to the one that will be exported with `expose-loader`.

If you use the standard structure for webpack (with `main.js` and `app.js` files), you won't need `ProvidePlugin` if you require each module in the `main.js` (since this is where they will be run).

### Making something available bundlewide

If you want something available throughout the bundle, but not sitwide, use `ProvidePlugin`. Using this also means you don't need to `require` it everywhere as long as you specify it in your webpack config.
