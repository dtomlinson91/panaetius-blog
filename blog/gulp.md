# Gulp

Gulp can complement webpack by adding additional workflows to your project. Webpack can be used to package your bundles, gulp can be used to run additional things before or after the build.

<https://forestry.io/blog/gulp-and-webpack-best-of-both-worlds/>

Using node we could run our webpack command and build commands seperately in the workflow. We could use gulp to use one command to do both. We can also use gulp to build the search index of an app as part of this workflow.

## Creating a gulpfile

`yarn add gulp`

Create a `gulpfile.js` in the root of your project next to the `package.json` file.


