const { run } = require("./build-lunrjs-index");
const gulp = require("gulp");
const util = require("util");
const execFile = util.promisify(require("child_process").execFile);
const exec = util.promisify(require("child_process").exec);
const { getCurrentDir } = require("./utils");

async function buildSearch(cb) {
  return run();
}

async function buildHugo(cb) {
  await execFile("hugo", ["-D", "--minify"]);
}

async function buildTheme(cb) {
  var themeDir = getCurrentDir(__dirname) + "/themes/panaetius-theme";
  console.log(themeDir);
  await exec(
    `cd ${themeDir} && node ${themeDir}/node_modules/webpack/bin/webpack.js --config ${themeDir}/webpack.prod.js`
  );
}

module.exports = {
  buildSearch: buildSearch,
  buildHugo: buildHugo,
  buildTheme: buildTheme,
  buildBlog: gulp.parallel([buildSearch, buildHugo, buildTheme]),
};
