---
title: VuePressマークダウン記法メモ
date: 2020-01-01
description: ディスクリプション
category: dev
tags: []
---

# {{ $frontmatter.title }}

## Table of Contents

[[toc]]

## Default Title

::: tip
This is a tip
:::

::: warning
This is a warning
:::

::: danger
This is a dangerous warning
:::

::: details
This is a details block, which does not work in IE / Edge
:::

## Table

| Tables        |      Are      |   Cool |
| ------------- | :-----------: | -----: |
| col 3 is      | right-aligned | \$1600 |
| col 2 is      |   centered    |   \$12 |
| zebra stripes |   are neat    |    \$1 |

## Code

```js
export default {
  name: "MyComponent",
  // ...
};
```
