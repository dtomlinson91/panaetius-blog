---
title: "Automatically Generate a Changelog for a Python Application/Library using git-cliff"
date: 2022-01-18T01:48:06Z
images:
  - "images/banner.png"
authors:
  - "Daniel Tomlinson"
tags:
  - "python"
  - "git"
series:
  - "series"
draft: true
banner: true
---

Using [git-cliff](https://github.com/orhun/git-cliff) together with an [Angular commit style](https://gist.github.com/brianclements/841ea7bffdb01346392c), we can use the Python task runner [duty](https://pawamoy.github.io/duty/) to automatically create a changelog of new features/changes for a Python application/library.

<!--more-->

## Requirements

### git-cliff

`git-cliff` is an application written in rust that reads commits and automatically generates a changelog.

#### installation
