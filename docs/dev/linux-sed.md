---
title: "[Linux]sedの備忘録"
date: 2021-01-31
description: "sedを使ってデータの一括置き換えをしたい時のための備忘録。"
category: dev
tags: ["linux"]
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## 目次

[[toc]]

## 削除

まず、偶数行・奇数行をそれぞれ削除したい時。
準備として偶数行と奇数行に異なる文字列を出力したファイルを準備。

```bash
$ for i in {1..10}; do
if [ $(($i % 2)) = 0 ]; then
echo '偶数行です'
else
echo '奇数行です'
fi
done > number.txt

$ cat number.txt
奇数行です
偶数行です
奇数行です
偶数行です
奇数行です
偶数行です
奇数行です
偶数行です
奇数行です
偶数行です
```

### 偶数行を削除したい

```bash
$ sed -i -e 'n; d' number.txt
$ cat number.txt
奇数行です
奇数行です
奇数行です
奇数行です
奇数行です
```

### 奇数行を削除したい

```bash
$ sed -i -e '1d; n; d' number.txt
$ cat number.txt
偶数行です
偶数行です
偶数行です
偶数行です
偶数行です
```

## 置換

### 特定の文字列を、空白を含む文字列へ一括置き換えしたい

スペースをエスケープすればいいだけだった。

```bash
# 準備
$ pen='これはペンです。\n'
$ printf $pen"%.s" {1..10} > pen.txt
$ cat pen.txt
これはペンです。
これはペンです。
これはペンです。
これはペンです。
これはペンです。
これはペンです。
これはペンです。
これはペンです。
これはペンです。
これはペンです。

# 置換
$ sed -i -e "s/これはペンです。/This\ is\ a\ pen\./g" pen.txt
$ cat pen.txt
This is a pen.
This is a pen.
This is a pen.
This is a pen.
This is a pen.
This is a pen.
This is a pen.
This is a pen.
This is a pen.
```
