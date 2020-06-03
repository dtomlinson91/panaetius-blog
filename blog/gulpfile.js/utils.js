function getCurrentDir(dir) {
  var themeDir = dir.split("/");
  themeDir.pop();
  return themeDir.join("/");
}

exports.getCurrentDir = getCurrentDir
