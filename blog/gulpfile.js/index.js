// Imports
const gulp = require("gulp");
const util = require("util");
const execFile = util.promisify(require("child_process").execFile);
const exec = util.promisify(require("child_process").exec);
const { getCurrentDir } = require("./utils");
const imagemin = require("gulp-imagemin");
const clean = require("gulp-clean");

// Directories
const currentDir = getCurrentDir(__dirname);
const themeDir = getCurrentDir(__dirname) + "/themes/panaetius-theme";

// Function to build the Hugo project
async function buildHugo(cb) {
  await execFile("hugo", ["--minify"]);
}

// Function to minify images
function minifyImages(cb) {
  gulp
    .src([`${currentDir}/public/**/*.png`, `${currentDir}/public/**/*.svg`])
    .pipe(imagemin())
    .pipe(
      gulp.dest(function (file) {
        return file.base;
      })
    );
  cb();
}

// Function to sync static assets to S3 instead of using git LFS.
async function syncAssets(cb) {
  await exec(
    `aws s3 sync ${currentDir} s3://prod-panaetius-blog-static-assets/ --exclude "*" --include "*.png" --exclude "*node_modules/*" --exclude "*resources/*"  --exclude "public/*" --delete --profile admin`
  );
  cb();
}

async function syncAssetsR(cb) {
  await exec(
    `aws s3 sync s3://prod-panaetius-blog-static-assets/ ${currentDir} --exclude "*" --include "*.png" --exclude "*node_modules/*" --exclude "*resources/*"  --exclude "public/*" --delete --profile admin`
  );
  cb();
}

// Function to build the theme
async function buildTheme(cb) {
  console.log(themeDir);
  await exec(`cd ${themeDir} && yarn buildGlobal `);
  cb();
}

module.exports = {
  buildTheme: buildTheme,
  buildBlog: gulp.series([
    // buildSearch,
    buildTheme,
    // gulp.series(cleanJS, minifyJS, insertLunrJS),
    buildHugo,
    minifyImages,
  ]),
  syncAssets: syncAssets,
  syncAssetsR: syncAssetsR,
};
