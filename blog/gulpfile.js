import run from "build-lunrjs-index";
import { promise } from "readdirp";

const gulp = require("gulp");
// const webpack = require("webpack");
// const webpackConfig = require("./web")

function buildSearch(cb) {
  return new promise((resolve, reject) => {
    run();
    resolve();
  });
}

exports.build = buildSearch;
