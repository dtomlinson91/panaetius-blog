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
const merge = require("merge-stream");

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
      // `${currentDir}/content/**/*.png`,
      // `${currentDir}/content/**/*.svg`,
      // `${currentDir}/static/**/*.png`,
      // `${currentDir}/static/**/*.svg`,
      // `${themeDir}/static/**/*.png`,
      // `${themeDir}/static/**/*.svg`,
      `${currentDir}/public/**/*.png`,
      `${currentDir}/public/**/*.svg`,
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
async function cleanJS() {
  gulp.src(`${currentDir}/static/dist/*.js`, { read: false }).pipe(clean());
}

// Define js scripts outside of webpack bundle.
// const jsFiles = {
//   lunrjs_gulp: {
//     node_path: "/node_modules/lunr/lunr.js",
//   },
// };

var jsFiles = [
  {
    module: "lunrjs_gulp",
    nodePath: "/node_modules/lunr/lunr.js",
    minimizedFile: "",
  },
];

function minifyJS() {
  destinationPath = `${currentDir}/static/dist/`;
  var streams = [];
  jsFiles.forEach(function (module) {
    var stream = gulp
      .src(`${currentDir}/${module["nodePath"]}`)
      .pipe(hash({ format: "{name}.{hash}.{ext}" }))
      .pipe(uglify())
      .pipe(
        rename(function (path) {
          // append min to the filename
          path.basename += "min";
          // add minimizedFile to the object
          module["minimizedFile"] = path.basename + path.extname;
        })
      )
      .pipe(gulp.dest(destinationPath));
    streams.push(stream);
  });
  return merge(streams);
}

function insertLunrJS() {
  var streams = [];
  jsFiles.forEach(function (module) {
    // console.log(JSON.stringify(module["minimizedFile"]));
    var stream = gulp
      .src([`${themeDir}/layouts/search/single.html`])
      .pipe(replace(module["module"], module["minimizedFile"]))
      .pipe(
        gulp.dest(function (file) {
          return file.base;
        })
      );
    streams.push(stream);
  });
  return merge(streams);
}

module.exports = {
  buildSearch: buildSearch,
  buildHugo: buildHugo,
  buildTheme: buildTheme,
  minifyImages: minifyImages,
  cleanJS: cleanJS,
  minifyJS: minifyJS,
  buildLunr: gulp.series(cleanJS, minifyJS, insertLunrJS),
  buildBlog: gulp.series([
    buildSearch,
    buildHugo,
    buildTheme,
    minifyImages,
    gulp.series(cleanJS, minifyJS, insertLunrJS),
  ]),
};
