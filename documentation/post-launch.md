Append onto the <ul class="nav"></ul> object, not the #toc to get the back to top at the bottom.

Fix colour + formatting

Document seperate all the JS/SCSS out - code that only needs to be run on the posts page should be seperated into the seperate webpack config.

Document Gulp to build webpack


If another entrypoint depends on a module you can use expose-loader in the webpack config. It will be available to other entrypoints and globally. This is useful if you want to have a 3rd party library as an entrypoint (bootstraptoc) which requires jquery to be available and imported. You can't edit this file to import jquery, it just runs when its loaded on a page. It needs jquery to be available - hence we use expose loader to acheive this.


When using entrypoints for 3rd party, you can give it a list of equivalent import statements. E.g to entrypoint bootstrap you can do:

```javascript
  entry: {
    mainGlobal: path.resolve(__dirname, "../src/mainGlobal.js"),
    vendors: ["bootstrap"],
  },
```

instead of

```javascript
  entry: {
    mainGlobal: path.resolve(__dirname, "../src/mainGlobal.js"),
    bootstrap: path.resolve(
      __dirname,
      "../node_modules/bootstrap/dist/js/bootstrap.js"
    ),
    showModal: path.resolve(__dirname, "../src/js/global/exports.js"),
  },
```

Todo: can we have bootsrap available global wide? At the moment it is required twice, once in posts and once in global. It's the same code just needs to be loaded in twice for context?
YES: we should use an entrypoint for bootstrap. As it needs jquery we should use expose-loader to make jquery available sitewide. Make sure jquery is loaded first. Make sure jquery is loaded with expose-loader in the main webpack file, not in common or any sub files. We need it to be available globally and for any other bundles. If you do this you don't need to import it any other bundles or files. It will be avaialble globally. It's similar to using the provideplugin except instead of making it available for that bundle, we are making it available everywhere no matter the bundle.

Rule of thumb:

- If you need to run a script sitewide: use an entrypoint (this is good for random javascript files, CDN files etc). An entrypoint is ran when it is inserted into the page.
- If you need something available to be imported/ready to use sitewide (available to other bundles**): use expose-loader. (this is good for modules like jquery)
- If you need something bundlewide, but not sitewide, use provideplugin.

**only the case if in the bundle it is exposed with expose-loader it is used. I.e jquery is used in bootstrap so its available to other bundles.

- To export a function/s for use in the front end you should create an entry point with all the functions you want to export. This entrypoint should use export default or similar syntax to export the modules. Add the output to the webpack config and you will be able to access these functions from the front end.


Todo:

- Document patterns/usecases.
    - Using an entry point to write scripts to be ran on each page.
    - Using jquery to do things when an element is clicked.
    - Exporting a function to be used in the front end.
- Figure out whats going on with jquery when using expose loader and no imports. If its used in bootstrap its bundled with it, if its not then its not available in the bundle, but it is available sitewide.

- Document the standard structure using a `main` and `app`. Document the optional extra with additional optional bundles.

Notes:

If we use expose-loader for jquery, but we don't use jquery in the bundle - it won't be included in the bundle and won't be available site-wide. If we use expose-loader, make sure to require it (with a webpackchunkname) in the main.js file so it is guaranteed to be bundled up and available site wide.
