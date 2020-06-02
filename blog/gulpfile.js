// import run from "build-lunrjs-index";
// import { promise } from "readdirp";
const run = require("./build-lunrjs-index");
const gulp = require("gulp");
// const webpack = require("webpack");
// const webpackConfig = require("./web")

function buildSearch(cb) {
  run.run();
  cb();
}

exports.buildSearch = buildSearch;
