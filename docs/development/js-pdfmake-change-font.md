---
title: "pdfmakeで日本語フォントを適用する"
date: 2021-03-05
description: "クライアントサイドでPDF出力を行えるライブラリpdfmakeで任意の日本語フォントで出力できるようにする。ダウンロードしてきた源真ゴシックのvs_fonts.jsを設定していたけれど、全角記号が対応していないらしく、pdfmake で出力を行うと上手く出力されないことがわかった。そのため IPA フォントを自分でダウンロードしてフォントを設定することにした。"
category: dev
tags: ["pdfmake", "javascript"]
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## 目次

[[toc]]

## pdfmake で任意のフォントを使用するために

pdfmake で任意のフォントを設定したい場合に必要な手順として、

- 使用したいフォントファイルでビルドされた`vfs_fonts.js`を読み込む
- 出力時の設定（docDefinition） で使用したいフォントを指定

という手順が必要。

[pdfmake: CUSTOM FONTS (CLIENT-SIDE)](https://pdfmake.github.io/docs/0.1/fonts/custom-fonts-client-side/vfs/)

最初はビルドした状態で配布されていた下記の`vs_fonts.js`を使用していたが、源真ゴシックは全角記号が対応していないらしく、pdfmake で出力を行うと一部文字が上手く出力されないことがわかった。

[naoa/pdfmake: Client/server side PDF printing in pure JavaScript](https://github.com/naoa/pdfmake)

そのため IPA フォントを使用することにしたが、`vs_fonts.js`を自分でビルドして読み込ませる必要があった。

## 日本語フォントの設定方法

### (準備)プロジェクト内で pdfmake をインストール

```sh
npm install --save pdfmake
```

### 使用したいフォントをダウンロードする

IPA フォントを使うことにした。IPA フォントは独立行政法人情報処理推進機構 (IPA) によって配布されている日本語のフォントで、無料で使用することができる。

[IPA フォント](https://ja.osdn.net/projects/ipafonts/releases/51868)

### node_modules 内で pdfmake をインストール&ビルド

```sh
cd node_modules/pdfmake
npm install
npm run build
```

### フォントファイルを置くディレクトリを作成

次に`node_modules/pdfmake`内に下記のディレクトリを作成する

```sh
mkdir -p node_modules/pdfmake/examples/fonts
```

ここに先ほどダウンロードしたフォントファイルを置く。

```sh
ls node_modules/pdfmake/examples/fonts
ipagp.ttf
```

### gulp でビルド

gulp がインストールされていない場合はインストールしておく。(下記はグローバルインストール)

```sh
npm install -g gulp
```

`node_modules/pdfmake`へ移動し、フォントをビルド。

```sh
cd node_modules/pdfmake
gulp buildFonts
```

ビルド後に、`node_modules/pdfmake/build`内に`vfs_fonts.js`ファイルが存在している。

```sh
ls build
pdfmake.js         pdfmake.js.map     pdfmake.min.js     pdfmake.min.js.map vfs_fonts.js
```

vfs_fonts.js を開いてみて、下のようにダウンロードしたフォントが記載されていればビルドされている。

```js
this.pdfMake = this.pdfMake || {}; this.pdfMake.vfs = {
  "ipagp.ttf": "AAEAAAASAQAABAAgR0RFRgAmMb0AAAEsAAAAHkdTVUKdzPpJAAABTAAADdpPUy8yVVZ3xgAADygAAABgY21hcIF1B+wAAA+IAAOXtmN2dCAjYx17AAOnQAAAAKRmcGdt4nQCpQADp
  ...
```

### docDefinition でフォントを指定

後はドキュメントに記載の通り、使用したいフォントを設定する。

```js{7,19}
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from "~/static/js/vfs_fonts";
import htmlToPdfmake from "html-to-pdfmake";

pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
  ipagp: {
    normal: "ipagp.ttf",
    bold: "ipagp.ttf",
    italics: "ipagp.ttf",
    bolditalics: "ipagp.ttf",
  }
};

...

const docDefinition = {
    defaultStyle: {
      font: "ipagp",
    },
    content: [htmlToPdfmake(html, {tableAutoSize:true})],
  };
  pdfMake.createPdf(docDefinition).download();
```
