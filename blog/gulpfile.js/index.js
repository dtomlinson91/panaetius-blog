// Imports
const { run } = require("./build-lunrjs-index");
const gulp = require("gulp");
const util = require("util");
const execFile = util.promisify(require("child_process").execFile);
const exec = util.promisify(require("child_process").exec);
const { getCurrentDir } = require("./utils");
const fs = require("fs");
const imagemin = require("gulp-imagemin");
const uglify = require("gulp-uglify");
const hash = require("gulp-hash-filename");
const rename = require("gulp-rename");
const clean = require("gulp-clean");
const replace = require("gulp-replace");

// Directories
const currentDir = getCurrentDir(__dirname);
const themeDir = getCurrentDir(__dirname) + "/themes/panaetius-theme";

// Function to build and write the search index
async function buildSearch(cb) {
  let searchIndex = await run();
  fs.writeFileSync(currentDir + "/static/search-index.json", searchIndex);
  cb();
}

// Function to build the Hugo project
async function buildHugo(cb) {
  await execFile("hugo", ["-D", "--minify"]);
}

// Function to minify images
function minifyImages(cb) {
  gulp
    .src([
      `${currentDir}/content/**/*.png`,
      `${currentDir}/content/**/*.svg`,
      `${currentDir}/static/**/*.png`,
      `${currentDir}/static/**/*.svg`,
      `${themeDir}/static/**/*.png`,
      `${themeDir}/static/**/*.svg`,
    ])
    .pipe(imagemin())
    .pipe(
      gulp.dest(function (file) {
        return file.base;
      })
    );
  cb();
}

// Function to build the theme
async function buildTheme(cb) {
  console.log(themeDir);
  await exec(
    `cd ${themeDir} && node ${themeDir}/node_modules/webpack/bin/webpack.js --config ${themeDir}/webpack.prod.js`
  );
}

// Clear ./static/dist
function cleanJS(cb) {
  gulp.src(`${currentDir}/static/dist/*.js`, { read: false }).pipe(clean());
  cb();
}

// Copy lunrjs into static
const jsFiles = {
  lunrjs_gulp: "s",
};

function lunr(cb) {
  gulp
    .src(`${currentDir}/node_modules/lunr/lunr.js`)
    .pipe(hash({ format: "{name}.{hash}.{ext}" }))
    .pipe(uglify())
    .pipe(
      rename(function (path) {
        file = path.basename += "min";
        for (const key in jsFiles) {
          if (jsFiles.hasOwnProperty(key)) {
            jsFiles.key = file += ".js";
            console.log(jsFiles.key);
          }
        }
      })
    )
    .pipe(gulp.dest(`${currentDir}/static/dist`));
  cb();
}

// Insert js into HTML
function insertJS(cb) {

  cb();
}

module.exports = {
  buildSearch: buildSearch,
  buildHugo: buildHugo,
  buildTheme: buildTheme,
  minifyImages: minifyImages,
  cleanJS: cleanJS,
  insertJS: insertJS,
  lunr: lunr,
  buildBlog: gulp.parallel([
    buildSearch,
    buildHugo,
    buildTheme,
    minifyImages,
    lunr,
  ]),
};
