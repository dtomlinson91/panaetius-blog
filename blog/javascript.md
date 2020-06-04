# Javascript

## Promises

### wrapping a method/function in a promise

If a method you are importing does not return a promise, you can wrap it in one so you can use `async` `await`.

```javascript
const util = require("util");
const execFile = util.promisify(require("child_process").execFile);
```

Use `util.promisify` on the `import`/`require` to wrap it in a promise.

## await multiple tasks at the same time

You do not have to sequentially `await` functions in turn. It is possible to fire off multiple at the same time and then wait for them all to finish:

```javascript
let [foo, bar] = await Promise.all([getFoo(), getBar()]);
```

You wrap each function you want in `Promise.all()` - this takes an array of promises, and composes them all into a single promise. This will only resolve when every promise in the array has resolved itself.

**Important** - `Promise.all()` does not _dispatch_ or _do_ the promises, it only waits on them. This is why in the example above we are calling them in the array. If we don't call them we would have to call them later (from another function) since it would pause here and wait for them to complete.

## dispatch a promise and await it later

It is possible to dispatch a promise to run asynchronously, and continue on with your function. Later on in the function you can `await` it and get the results.

This is really useful if your function does a job remotely and you want to do something else while it gets the results:

```javascript
async function buildSearch(cb) {
  // run() returns a promise
  let searchIndex = run();
  //   do something...
  let searchIndexResult = await searchIndex;
}
```

## Writing to files

You can write a string/json object to a file:

```javascript
async function buildSearch() {
  // index is a js object
  let searchIndex = JSON.stringify(index);
  fs.writeFileSync(currentDir + "/static/search-index.json", searchIndex);
}
```
