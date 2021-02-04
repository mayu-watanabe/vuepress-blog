---
title: "MVCモデルなどのViewでコメントを残す場合はサーバーサイド言語で"
date: 2021-02-05
description: "View側でコメントを残す場合に気をつけること。つい忘れがちでコードレビューで指摘されてしまうので。"
category: dev
tags: []
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## 目次

[[toc]]

## 概要

普段 PHP で開発しているが、View 側でコメントを残す場合につい HTML のコメントで残してしまうが、PHP のコメントで残した方がコード的には良い。

何度かコードレビューで指摘されてしまったので、同じミスをしないように、何故サーバーサイド言語で残すべきなのかをまとめる。

## クライアントサイド言語(HTML,CSS, Javascript)でコメントを残した場合

```php
<body>
  <div class="flex-center position-ref full-height">
    <?-- This is HTML Comment -->
      <div class="content">
          <div class="title m-b-md">
              Hello World
          </div>
```

→ 検証ツールで確認すると、ソースコードにコメントが残る

## サーバーサイド言語(PHP)でコメントを残した場合

```php
<body>
  <div class="flex-center position-ref full-height">
    <?php //This is PHP Comment ?>
      <div class="content">
          <div class="title m-b-md">
              Hello World
          </div>
```

→ 検証ツールで確認すると、ソースコードにコメントが残らない

## まとめ

サーバーサイド言語の場合、コンパイルする時にコメントが削除される(PHP はインタプリタ言語だが、厳密には実行前にコンパイルを行っているので)。

コメントを残すことはメンテナンス性を重視する上で必要だが、ブラウザから誰でもアクセスできるソースコードにコメントが残っているのは好ましくないので、コメントを残す時は気をつけようと思う。
