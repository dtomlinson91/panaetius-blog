const { run } = require("./build-lunrjs-index");
const gulp = require("gulp");
const util = require("util");
const execFile = util.promisify(require("child_process").execFile);
// const execFile = require("child_process").execFile;

async function buildSearch(cb) {
  return run();
}

async function buildHugo(cb) {
  await execFile("hugo", ["-D", "--minify"]);
}

module.exports = {
  buildSearch: buildSearch,
  buildHugo: buildHugo,
  buildBlog: gulp.parallel([buildSearch, buildHugo]),
};
