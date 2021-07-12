# Coming back

Node versions for node-sass if getting errors: <https://stackoverflow.com/questions/60394291/error-node-modules-node-sass-command-failed>

Gulp is used to do general scripting + image minifying, the actual js/scss is done by webpack.
The imaging is done by gulp because a gulp function syncs the images from s3 and we want to do it
on the final hugo build.

All JS/SCSS go into the theme. The theme is built first which creates a `./static` folder.

All the theme is JS/SCSS, nothing more.
The theme has two entry points, one for the whoel site, one for the posts page only.
This is two different builds defined in webpack.

The main site has gulp code to minify js. This is for lunr. This is in the main site and not the theme because
the main site has the content, the theme doesn't so it can't build it there.

When doing a Hugo build, this is merged per <https://gohugo.io/hugo-modules/theme-components/>.

The main site content should go in the main repo. All the config/styling is done per the theme.

cleanJS() removes all js in `./static/dist`
minifyJS() minifies the js files defined in `jsFiles`
insertLunrJS() inserts it into the html file (which needs changing).
The `module: "lunrjs_gulp",` in `jsFiles` is the string it looks for to insert the link to the js file generated.


The theme uses webpack to build itself.
The main blog just uses Gulp.

The webpack is mainly boilerplate, standard for css/sass/js.


Needs changing:
The lunr js inserting needs applying after the build
public/search/index.html
not to the src in
/Users/dtomlinson/git-repos/web-dev/panaetius-blog/blog/themes/panaetius-theme/layouts/search


Is there something else than LUNR for search in a static site?

Change the theme to dark + red
Find a better layout for the TOC

Can we simplify the webpack/gulp workflow?

Can the lunr source be done in the blog, same as the jQuery?
https://stackoverflow.com/questions/44151194/how-to-add-a-js-file-with-webpack
https://webpack.js.org/loaders/expose-loader/

Get all the documentation into Trilium
Create a simple overview (like this) after potentially simplifying the gulp/webpack
