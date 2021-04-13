const fs = require('fs');
const path = require('path');

const dirpath = "./docs";
const exclude = ["about"];
const dirs = fs.readdirSync(dirpath).filter((f) => {
  return fs.existsSync(dirpath + "/" + f)
    && fs.statSync(dirpath + "/" + f).isDirectory()
    && !f.startsWith('.')
    && !exclude.includes(f);
})

// 並び順
const order = ["frontend", "backend", "daily"];
dirs.sort((x, y) => { return order.indexOf(x) - order.indexOf(y) });

const sidebarArray = dirs.map((dir) => {
    const childrenArr = fs.readdirSync(dirpath + "/" + dir).map((childDir) => {
      // ファイル名の取得
      let base = new String(childDir).substring(childDir.lastIndexOf('/') + 1);
      if (base.lastIndexOf(".") != -1) {
        base = base.substring(0, base.lastIndexOf("."));
      }
      if (base == "README") {
        return false;
      } else {
        return "/" + dir + "/" + base;
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
}).filter((f) => {
  // README.md以外の記事が存在しない場合、サイドバー非表示
  return f.children.length
});

module.exports = {
  title: 'urania.',
  description: 'daily logs',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'About', link: '/about/' },
    ],
    sidebar: sidebarArray,
    displayAllHeaders: false,
    
  },
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ]
}