# Exporting functions for the frontend

## Example

An example of this is here: <https://github.com/dtomlinson91/panaetius-theme/tree/modal/frontend-function>.

Look at

- `./webpack/webpack.prod.js` - entrypoint, output.
- `./src/js/global/exports.js` - functions

Access the function from the frontend with `showModal.default.showModal()`.

## Documentation

If you need to export a function for use in the front-end, you should create the functions in a `js` file.

In the webpack config, create an entrypoint with all the functions you want to export. This entrypoint should use the standard `export default functionName` or `export default { functionName: functionName }` syntax.

You should add the output to the webpack config.

Then any function can be accessed in the frontend by it's entrypoint name:

`showModal.default.showModal()`.

