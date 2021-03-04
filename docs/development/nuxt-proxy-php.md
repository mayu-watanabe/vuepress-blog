---
title: "NuxtからPHPファイルを実行する場合のエンドポイントの設定方法"
date: 2021-03-04
description: "Nuxtで作っていたアプリでファイル作成・書き込みを行いたく、サーバーサイドの処理はPHPファイルで実行することにした。その時のエンドポイント設定方法のまとめ。"
category: dev
tags: ["nuxt", "php"]
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## 目次

[[toc]]

## やりたいこと

Nuxt でブラウザベースのアプリを作っていて、フォームで入力した値をファイルに出力し、指定したディレクトリにそのファイルを保存する処理を実装する必要があった。だが、Javascript ではファイルの書き込みはできないので、サーバーサイドで実装する必要があった。

今回は個人的な用途で使うためのローカル環境で動くことを想定しているアプリなので、サーバーサイドの処理は単一の PHP ファイルを用意し、axios を使ってクライアントサイドからエンドポイントを叩いて実行することにした。

## 処理の流れ

1. ブラウザでフォーム入力
2. axios で、HTTP 通信の POST で入力データを送る
3. PHP 側でデータを受け取り、ファイルの書き込みを行う

## Nuxt から PHP ファイルを実行する際のエンドポイントの設定手順

実装方法は下のリンクを参考にした。

[Configure local php endpoint for Axios in Nuxt JS
](https://stackoverflow.com/questions/57367721/configure-local-php-endpoint-for-axios-in-nuxt-js)

### static ディレクトリに static/api/index.php を作成

staic 下に api という名前でディレクトリを作成する（ディレクトリ名は任意で OK）。api 下に`index.php`ファイルを作成する。
このファイルにサーバーサイドの処理を実装する。

### npm で必要なパッケージをインストールする

- `concurrently` : npm で複数のコマンドの実行を可能にする。
- `@nuxtjs/axios` : ブラウザや node.js で動く Promise ベースの HTTP クライアント。
- `@nuxtjs/proxy` : proxy の設定を行う。

```sh
npm install -save concurrently @nuxtjs/axios @nuxtjs/proxy
```

### config.nuxt.js の設定を変更

```js{5,6,9-19}
export default {
  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
  ],

  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      pathRewrite: {
        '^/api' : '/'
      }
    },
  },

  axios: {
    baseURL: '/',
  },
```

通常 nuxt でローカル環境を立てるとデフォルトで URL が`http://localhost:3000/`で立ち上がる。
上の proxy の設定では、リクエストする URL に`/api`が含まれる場合は、`http://localhost:8000`へアクセスするように設定している。

### package.json のスクリプトを変更

```json{2}
"scripts": {
    "dev": "concurrently -k \"nuxt --\" \"php -S 0.0.0.0:8000 static/api/index.php\"",
    "build": "nuxt build",
    "start": "nuxt start",
    "generate": "nuxt generate"
  },
```

`npm run dev`でローカル環境を立ち上げる際に、PHP のサーバーも同時に立ち上げている。

### Vue で 非同期通信の実装

上記を設定すると、`http://localhost:3000/api`のエンドポイントを叩いた時に、`static/api/index.php`の処理が実行されるようになる。あとは Vue 側で非同期通信を実装するだけ。

```js
import Vue from "vue";
import Axios from "axios";
import VueAxios from "vue-axios";

Vue.use(VueAxios, Axios);
export default Vue.extend({

  ...

  methods: {
    save: function() {
      Axios.post("./api", {
        data: this.inputs,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error.response);
      });
    },

    ...
  },
});
```

```php
<?php
header('Content-type: application/json; charset=utf-8');

// JSONデータを受け取る
$rawPaylaod = file_get_contents('php://input');

...

```
