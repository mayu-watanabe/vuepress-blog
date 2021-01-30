const fs = require('fs');
const path = require('path');

var dirpath = "./docs";
var dirs = fs.readdirSync(dirpath).filter((f) => {
  return fs.existsSync(dirpath + "/" + f) && fs.statSync(dirpath + "/" + f).isDirectory() && !f.startsWith('.');
})
var sidebarArray = ["/"].concat(
  dirs.map((dir) => {
    var childrenArr = fs.readdirSync(dirpath + "/" + dir).map((childDir) => {
      // ファイル名の取得
      var base = new String(childDir).substring(childDir.lastIndexOf('/') + 1);
      if (base.lastIndexOf(".") != -1) {
        base = base.substring(0, base.lastIndexOf("."));
      }
      if (base == "README") {
        return false;
      } else {
        return ["/" + dir + "/" + base, base];
      }
    }).filter((f) => {
      // 各ディレクトリのindexページは一覧に含めない
      return f != false;
    })
    return {
      title: dir.toUpperCase(),
      path: "/" + dir + "/",
      collapsable: true,
      sidebarDepth: 1,
      children: childrenArr
    }
  }));

module.exports = {
  title: 'urania.',
  description: 'daily logs',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Dev', link: '/dev/' },
    ],
    sidebar: sidebarArray,
    displayAllHeaders: true,
  },
}