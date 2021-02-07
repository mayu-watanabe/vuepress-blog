---
title: "[Vue/Vuepress]frontmatterの日付を年月日の表示へ整形する"
date: 2021-02-07
description: Vuepress(Vue)のfrontmatterで定義されている各記事の日時を表示させる方法。
category: dev
tags: ["vue"]
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## 目次

[[toc]]

## 前提

```yml
---
title: "[Vue]frontmatterの日付を年月日の表示へ整形する"
date: 2021-02-07
description: frontmatterで定義されている各記事の日時を表示させる方法。
category: dev
tags: []
---

```

このブログは Vuepress を使って構築している。各記事のマークダウンファイルの frontmatter で上のように日付を定義している。

記事一覧画面などで、各記事の投稿日時を年月日の形で表示させたい。

## 方法

View で foreach で記事一覧を表示させている箇所。

```html
<div class="theme-default-content">
  <div v-for="(post, index) in posts" class="post">
    <span>{{ post.frontmatter.date }}</span>
    <a :href="post.regularPath"><h3>{{ post.title }}</h3></a>
    <p>{{ post.frontmatter.description }}</p>
  </div>
</div>
```

`post.frontmatter.date`のところは、このままビルドすると

```html
<span>2021-01-31T00:00:00.000Z</span>
```

というように ISO 8601（RFC 3339）の形で日時が表示される。
これを`2021-01-31`や`2021年01月31日`という形で表示させたい。

実装の流れとしては、

- 1. テンプレートの computed プロパティに関数を追加
  - `post.frontmatter.date`の日付を引数として渡す
  - `post.frontmatter.date`の日付をタイムスタンプへ変換
- 2. タイムスタンプから年月日へ変換を行う関数を作成
- 3. View の HTML の部分に 1 の関数を適用

## 実装

### テンプレートの computed プロパティに関数を追加

date という名前で関数を追加する。

```js
export default {
  name: "Home",
  components: { NavLink },
  computed: {
    date: function() {
      return function(date) {
        // 引数dateには[post.frontmatter.date]の日付を渡す
      };
    },
  },
};
```

### datetime を timestamp へ変換

```js
export default {
  name: "Home",
  components: { NavLink },
  computed: {
    date: function() {
      return function(date) {
        var timestamp = Date.parse(date); // datetimeをtimestampへ変換
      };
    },
  },
};
```

### タイムスタンプから年月日へ変換を行う関数を作成

`getNowDateWithString`という名前の関数名を追加する。こちらの関数内で、タイムスタンプから年月日へ表示を整形する。

```js
import { getNowDateWithString } from "../util"; // utilクラスへ関数を追加した

export default {
  name: "Home",
  components: { NavLink },
  computed: {
    date: function() {
      return function(date) {
        var timestamp = Date.parse(date);
        return;
        getNowDateWithString(timestamp); // 先ほど変換したtimestampを渡す
      };
    },
  },
};
```

`getNowDateWithString`の関数内での処理。

```js
/**
 * convert timestamp to display date
 *
 * @param int timestamp
 */
export function getNowDateWithString(timestamp) {
  var dt = new Date(timestamp);
  var y = dt.getFullYear();
  var m = ("00" + (dt.getMonth() + 1)).slice(-2);
  var d = ("00" + dt.getDate()).slice(-2);
  var result = y + "-" + m + "-" + d;
  return result;
}
```

```js
var result = y + "-" + m + "-" + d;
```

`"-"`を、`/`や`年`などに置き換えると任意の表記に変えることができる。

### View 側

```html
<div class="theme-default-content">
  <div v-for="(post, index) in posts" class="post">
    <!-- 関数を適用 -->
    <span>{{ date(post.frontmatter.date) }}</span>
    <a :href="post.regularPath"><h3>{{ post.title }}</h3></a>
    <p>{{ post.frontmatter.description }}</p>
  </div>
</div>
```

### 全体

[[VuePress] Format posted date defined in frontmatter](https://gist.github.com/mayu-watanabe/c3be5d313c4af24e582100a0ac3d6d00)
