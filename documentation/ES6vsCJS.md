# ES6 vs CommonJS

The differences in using import/export between the two:

![Differences](https://i.stack.imgur.com/5WgFJ.png)

- Node is compatible with ES6. You can find a compatability table here: <https://node.green>.

## CommonJS

To export functions use `exports.name`:

```javascript
exports.run = run;
```

You can also use:

````javascript
module.exports = {
    run: run
}
```

for multiple exports.

To import functions use `require`. You can use object destructuring as well:

```javascript
const { run } = require("./build-lunrjs-index");
const gulp = require("gulp");
````

If using destructuring you can then run the function as if it were local:

```javascript
function buildSearch(cb) {
  run();
  cb();
}
```

If you don't use destructuring (`const run = require("./build-lunrjs-index");`) then you have to pass the constant name and the export you want in:

```javascript
function buildSearch(cb) {
  run.run();
  cb();
}
```

## Node and Gulp

If you are using node and or gulp you should use CJS for your module import and exports. You can use any javascript that node is compatible with in your code.
