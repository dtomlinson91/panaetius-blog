### Webpack config setup

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
