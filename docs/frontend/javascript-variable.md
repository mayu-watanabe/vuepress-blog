---
title: "[Javascript]var, let, constの使い分け"
date: 2021-04-08
description: "なんとなく使っていませんか？今更聞けないvar, let, constの違い。"
category: dev
tags: ["javascript"]
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## 目次

[[toc]]

## 再宣言・再代入が可能か

|       | 再宣言 | 再代入 |
| ----- | ------ | ------ |
| const | ×      | ×      |
| let   | ×      | ○      |
| var   | ○      | ○      |

### 再宣言が可能か

再宣言とは、変数や定数を最初に定義した後に、再度定義し直すこと。`var`のみ再宣言が可能で、`const` と `let` は再宣言した時点で Console にエラーが表示される。

```javascript
const a = 1;
const a = 2; // Uncaught SyntaxError: Identifier 'a' has already been declared
console.log(a);

let b = 1;
let b = 2; //  Uncaught SyntaxError: Identifier 'b' has already been declared
console.log(b);

var c = 1;
var c = 2;
console.log(c); // 2
```

### 再代入が可能か

再代入とは、変数や定数を最初に定義した後に、その変数・定数に別の値を代入すること(定数に代入っていうのも変な気もするけど)。`let`,`var`は再代入できるが、`const`は Console にエラーが表示される。

```javascript
const a = 1;
a = 2; // Uncaught TypeError: Assignment to constant variable.
console.log(a);

let b = 1;
b = 2;
console.log(b); // 2

var c = 1;
c = 2;
console.log(c); // 2
```

## スコープの違い

### スコープとは

スコープ(scope)とは「範囲」という意味。ここでは定義した変数や定数が参照できる範囲のことを指す。

Javascript のスコープには**グローバルスコープ**と**ローカルスコープ**の大きく分けて 2 種類のスコープが存在する。ローカルスコープはさらに 2 種類に分類でき、**ブロックスコープ**と**関数スコープ**が存在する。

- グローバルスコープ
  - Javascript のどこからでもアクセスが可能
- ローカルスコープ
  - ブロックスコープ
    - ブロックの中({}に囲まれた範囲)でのみアクセス可能
  - 関数スコープ
    - 関数内でのみアクセス可能

### const, let, var の スコープの違い

|       | スコープの種類 |
| ----- | -------------- |
| const | ブロック       |
| let   | ブロック       |
| var   | 関数           |

`const`と`let`は**ブロックスコープ**を持つので、ブロックの中({}に囲まれた範囲)でアクセス可能。それに対し、`var`は**関数スコープ**を持つので、その関数内でアクセスが可能。

```javascript
if (true) {
  const a = 1;
  console.log(a); // 1
}
console.log(a); // Uncaught ReferenceError: a is not defined
```

```javascript
if (true) {
  let b = 1;
  console.log(b); // 1
}
console.log(b); // Uncaught ReferenceError: b is not defined
```

```javascript
if (true) {
  var c = 1;
  console.log(c); // 1
}
console.log(c); // 1
```

## 変数の巻き上げ(hoisting)が起きるか

### 変数の巻き上げとは

Javascript 特有の挙動で**変数の巻き上げ**というものがある。

例えば下のようなコードを書いた場合、

```javascript
var test = "hello";

function exec() {
  console.log(test); // undefined
  var test = "bye";
  console.log(test); // "bye"
}

exec();
```

最初のログで`"hello"`が出力されそうに思えるのだが、実際は `undefined` で出力される。

Javascript では関数内のどこでも変数を宣言できる。そして、これらの変数は**いかなる場所で宣言されても、その関数の先頭で宣言された時と同じように動作する。**

上のコードは実際には下記のような動作をしている。

```javascript
var test = "hello";

function exec() {
  var test; // 先頭で宣言、この時変数の中身の代入までは行われない
  console.log(test); // undefined
  var test = "bye";
  console.log(test); // "bye"
}

exec();
```

この動作を**巻き上げ(hoisting)** と呼んでいるが、**巻き上げられるのは変数の宣言のみで、変数の中身の代入までは行われない**。

[知らないと怖い「変数の巻き上げ」とは？｜もっこり JavaScript ｜ ANALOGIC（アナロジック）](https://analogic.jp/hoisting/)

### const, let, var の巻き上げの動作時の違い

```javascript
function exec() {
  console.log(test); //  Uncaught ReferenceError: Cannot access 'test' before initialization
  const test = "bye";
  console.log(test); // "bye"
}

exec();
```

```javascript
function exec() {
  console.log(test); //  Uncaught ReferenceError: Cannot access 'test' before initialization
  let test = "bye";
  console.log(test); // "bye"
}

exec();
```

```javascript
function exec() {
  console.log(test); // undefined
  var test = "bye";
  console.log(test); // "bye"
}

exec();
```

`const`/`let`と`var`で挙動が異なる。前者は巻き上げが起こっていないように思えるが、**巻き上げは起きるが参照することができないエラー**を起こしているみたい。

```javascript
let test = "hello";

function exec1() {
  console.log(test); // "hello"
}

function exec2() {
  console.log(test); //  Uncaught ReferenceError: Cannot access 'test' before initialization
  let test = "bye";
  console.log(test);
}

exec1();
exec2();
```

巻き上げが起こっていなければ、exec2 の最初のログは"hello"を出力するはず。しかし実際は参照エラーになっている。なので、巻き上げは起きているが、参照できていないという挙動のようである。

> var で宣言された変数が undefined の値で始まるのとは異なり、let の変数は定義が評価されるまで初期化されません。変数を宣言より前で参照すると ReferenceError が発生します。変数はブロックの先頭から初期化が行われるまで、「一時的なデッドゾーン」にあるのです。
> [let - JavaScript | MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/let)

巻き上げが起こるが、変数は初期化はされていない状態が一時的に生じて参照エラーになる、ということなのかな？

[var,let,const の違いは、ブロックスコープと巻き上げ - 30 歳からのプログラミング](https://numb86-tech.hatenablog.com/entry/2016/08/27/132310)

## まとめ

`const`, `let`, `var` の挙動の違いは下記の通り。

|       | 再宣言 | 再代入 | スコープ | 巻き上げ                                        |
| ----- | ------ | ------ | -------- | ----------------------------------------------- |
| const | ×      | ×      | ブロック | 起こるが参照できない(Uncaught ReferenceError)   |
| let   | ×      | ○      | ブロック | 起こるが参照できない(Uncaught ReferenceError)　 |
| var   | ○      | ○      | 関数     | 起こる(undefined)                               |

再代入が必要な場合に、データ型の参照方法で `const` と `let` の使い分けが判断できる。

- プリミティブ型：再代入の場合に参照先が変更される
- オブジェクト：参照するオブジェクトが変更された際に再代入になる = オブジェクト内のキーや値が変更されても、変数に対する参照先が変わらないため再代入にならない

[【JavaScript】var / let / const を本気で使い分けてみた - Qiita](https://qiita.com/cheez921/items/7b57835cb76e70dd0fc4)

プリミティブ型に再代入したい場合は`let`、それ以外は`const`で定義できる。`var`はよほどのことがない限り使う場面は少ないだろう。
