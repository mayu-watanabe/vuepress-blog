---
title: "[PHP]UTF-8で多言語をファイル出力する際に文字化けする"
date: 2021-01-31
description: "PHPでUTF-8で中国語をテキストファイルに出力すると、開くアプリケーションによって文字化けが起きた場合の対処法。"
category: dev
tags: ["php"]
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## 目次

[[toc]]

## 元のプログラム

```php
<?php

$filePath = 'mojibake.txt';
$value = '你好';

$fh = fopen($filePath, 'w');
fwrite($fh, mb_convert_encoding($value, 'UTF-8'));
fclose($fh);
```

途中の処理は省略している。

```bash
$ cat mojibake.txt
你好%
```

ちゃんと出力されているし、Mac のテキストエディタで開いても正しく表示される。しかしこれを Excel で開くと文字化けしてしまう。

## 原因

アプリケーションによって、Unicode の符号化方式が判別できず、UTF-8・UTF-16・UTF-32 を判別できないため、文字化けが起きてしまう。

## 解決策

上を判別させるために、ファイル出力時の先頭に BOM をつける。

### BOM とは

BOM とは、Byte Order Mark の略称で、Unicode の符号化方式を判別するために、ファイルの先頭につける数バイトのマーク。

> プログラムがテキストデータを読み込む時、その先頭の数バイトからそのデータが Unicode で表現されていること、また符号化形式（エンコーディング）としてどれを使用しているかを判別できるようにしたものである。
> [バイトオーダーマーク - Wikipedia](https://ja.wikipedia.org/wiki/%E3%83%90%E3%82%A4%E3%83%88%E3%82%AA%E3%83%BC%E3%83%80%E3%83%BC%E3%83%9E%E3%83%BC%E3%82%AF)

BOM は以下の通り。

| 符号化形式 | エンディアンの区別 | BOM                 |
| ---------- | ------------------ | ------------------- |
| UTF-8      |                    | 0xEF 0xBB 0xBF      |
| UTF-16     | BE                 | 0xFE 0xFF           |
| UTF-16     | LE                 | 0xFF 0xFE           |
| UTF-32     | BE                 | 0x00 0x00 0xFE 0xFF |
| UTF-32     | LE                 | 0xFF 0xFE 0x00 0x00 |

今回は UTF-8 なので、`0xEF 0xBB 0xBF`を先ほどのファイルの先頭につけるようにする。

## 修正したプログラム

```php
<?php

$filePath = 'mojibake.txt';
$value = '你好';

$fh = fopen($filePath, 'w');

// add BOM
fwrite($fh, "\xEF\xBB\xBF");

fwrite($fh, mb_convert_encoding($value, 'UTF-8'));
fclose($fh);
```

Excel で開いても、正しく表示されるようになった。

## BOM 付かどうかファイル情報を調べる

ファイルに BOM が付いているかはコマンドで調べることができる。

```bash
$ file mojibake.txt
mojibake.txt: UTF-8 Unicode (with BOM) text, with no line terminators
```

BOM が付いていると`with BOM`と表示される。

```bash
$ file mojibake2.txt
mojibake2.txt: UTF-8 Unicode text, with no line terminators
```

BOM がない場合は表示されない。
