---
title: "Test Post"
date: 2020-07-23T00:16:22+01:00
images:
  - "images/banner.svg"
authors:
  - "Daniel Tomlinson"
tags:
  - "tag1"
series:
  - "series"
draft:
  - false
---

CF Lambda@Edge only need the lambda_function_association setting on the CF instance for the default origin.

<!--more-->

## Header

Content

### Second Header

Hello 💁🏻‍♀️

Deployed with circle CI ⏱

Beginning _strapi_ 🐳

`test.js` file below

{{< highlighter javascript "linenos=table,hl_lines=8 10-12,linenostart=1" test.js>}}
const webpack = require("webpack");
const webpackConfig = require("./webpack.prod");

function buildTheme(cb) {
  return new Promise((resolve, reject) => {
    webpack(webpackConfig, (err, stats) => {
      if (err) {
        return reject(err);
      }
      if (stats.hasErrors()) {
        return reject(new Error(stats.compilation.errors.join("\n")));
      }
      resolve();
    });
  });
}

module.exports = {
  buildTheme: buildTheme,
};
{{< / highlighter >}}
