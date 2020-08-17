# Using gulp.js to build webpack.

## Example

An example is the Panaetius Blog theme for Hugo:

- `gulpfile.js` - <https://github.com/dtomlinson91/panaetius-theme/blob/develop/gulpfile.js>
- `package.json` - <https://github.com/dtomlinson91/panaetius-theme/blob/develop/package.json>

Can run `yarn buildGlobal && yarn buildPosts` to build the bundles.

**Important: If you use gulp you won't see errors, make sure to use gulp for production building only and use the webpack commands directly for development.**

## Documentation

If you need to build multiple webpack bundles, you can automate the process using gulp.

### Approach

Create a `gulpfile.js` in the root of the repo.

Import each webpack config file (the `webpack.prod.js`) and add them to a list of configs.

Create a function that runs webpack with the config passed in - wrap this in a promise.

Export each function using `module.exports`.
