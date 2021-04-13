---
title: "Docker+Laravel+VSCode+Xdebug(v3.0.3)でリモートデバッグを行う"
date: 2021-04-03
description: "Dockerで構築したLaravelで、VSCodeでリモートデバッグを設定する方法。Xdebugのversionが3系で設定値が変わったことによりphp.iniの記載方法も気をつける必要がある。"
category: dev
tags: ["laravel", "php", "xdebug"]
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## 目次

[[toc]]

## やりたいこと

Laravel には LaravelDebugbar などの便利なライブラリが揃っているが、やはりリモートデバッグしないと開発進めにくい。Docker 環境で動かしている Laravel プロジェクトで、Xdebug を使ってリモートデバッグを設定することにした。エディタは VSCode で設定する。

## リモートデバッグとは

リモートデバッグが有効になると、ポチポチとデバッグしたい箇所に点（ブレイクポイント）をつけて処理を走らせることで、その都度点をつけた場所で処理が止まり、変数の中身などを吐き出してくれる。

リモートデバッグの仕組みは、PHP 本体を実行するサーバー側(今回は Docker)と、クライアント側(VSCode)の間に、リモートサーバーが存在し(VSCode)、実行中の PHP の処理をこのリモートサーバーが制御している。

**リモートデバッグの仕組み**

1. Xdebug が有効になった PHP を実行
2. PHP が DBGP プロトコルでリモートサーバーに接続
3. リモートサーバーがクライアントに対してコマンドを送る
4. クライアントがコマンドに対応する処理を実行し、レスポンスを返す

これによって、リモートサーバーとクライアントが対話的にデバッグできるようになっている。

リモートデバッグについて参考になった記事。

[[PHP] Xdebug のリモートデバッグ、理解していますか？](https://qiita.com/castaneai/items/d5fdf577a348012ed8af)

[Xdebug, DBGP で簡易リモートデバッガを作る](https://blog.freedom-man.com/xdebug-dbgp)

## Xdebug の設定手順

Docker で構築した Laravel プロジェクトで、VSCode のリモートデバッグを設定する。

### Docker 側の設定

#### 最初に試したこと(この方法では動かなかった)

[Docker で構築した Laravel 環境に、PHPStorm でステップ実行デバッグを仕掛ける](https://qiita.com/yagrush/items/c597b3a8f3836f1908e0#%E3%82%B5%E3%83%BC%E3%83%90%E3%83%BC%E5%81%B4%E4%BD%9C%E6%A5%AD) のサーバー側作業で説明されている方法で Dockerfile を修正し、ビルドを行った。

**Dockerfile の編集**

```/docker/php/Dockerfile
# 下記を追加

# XDebug
RUN pecl install xdebug \
  && docker-php-ext-enable xdebug
```

**php.ini の編集**

```/docker/php/php.ini
# 下記を追加

[xdebug]
xdebug.idekey="PHPStorm"
xdebug.remote_host = "host.docker.internal"
xdebug.default_enable = 1
xdebug.remote_autostart = 1
xdebug.remote_connect_back = 0
xdebug.remote_enable = 1
xdebug.remote_handler = "dbgp"
xdebug.remote_port = 9001
```

この状態でコンテナのビルドを行った後、app コンテナに入り、Xdebug が php 側に入っているかを確認。

```bash
$ docker-compose exec app bash

root@4677e29aaac1:/work/backend# php -v
[02-Apr-2021 16:07:55 UTC] Xdebug: [Config] The setting 'xdebug.default_enable' has been renamed, see the upgrading guide at https://xdebug.org/docs/upgrade_guide#changed-xdebug.default_enable (See: https://xdebug.org/docs/errors#CFG-C-CHANGED)
[02-Apr-2021 16:07:55 UTC] Xdebug: [Config] The setting 'xdebug.remote_autostart' has been renamed, see the upgrading guide at https://xdebug.org/docs/upgrade_guide#changed-xdebug.remote_autostart (See: https://xdebug.org/docs/errors#CFG-C-CHANGED)
[02-Apr-2021 16:07:55 UTC] Xdebug: [Config] The setting 'xdebug.remote_connect_back' has been renamed, see the upgrading guide at https://xdebug.org/docs/upgrade_guide#changed-xdebug.remote_connect_back (See: https://xdebug.org/docs/errors#CFG-C-CHANGED)
[02-Apr-2021 16:07:55 UTC] Xdebug: [Config] The setting 'xdebug.remote_enable' has been renamed, see the upgrading guide at https://xdebug.org/docs/upgrade_guide#changed-xdebug.remote_enable (See: https://xdebug.org/docs/errors#CFG-C-CHANGED)
[02-Apr-2021 16:07:55 UTC] Xdebug: [Config] The setting 'xdebug.remote_host' has been renamed, see the upgrading guide at https://xdebug.org/docs/upgrade_guide#changed-xdebug.remote_host (See: https://xdebug.org/docs/errors#CFG-C-CHANGED)
[02-Apr-2021 16:07:55 UTC] Xdebug: [Config] The setting 'xdebug.remote_port' has been renamed, see the upgrading guide at https://xdebug.org/docs/upgrade_guide#changed-xdebug.remote_port (See: https://xdebug.org/docs/errors#CFG-C-CHANGED)
PHP 8.0.0 (cli) (built: Dec  1 2020 03:33:03) ( NTS )
Copyright (c) The PHP Group
Zend Engine v4.0.0-dev, Copyright (c) Zend Technologies
    with Xdebug v3.0.3, Copyright (c) 2002-2021, by Derick Rethans
```

`with Xdebug v3.0.3, Copyright (c) 2002-2021, by Derick`というメッセージがあるのでインストールはされているが、`~has been renamed, see the upgrading guide`という警告メッセージが表示されている。

また、この状態でクライアント側(VSCode)でデバッグの設定を行っても、動いてくれない。

メッセージにある通り、Xdebug の 2 系から 3 系で設定値が変わっているので、php.ini の Configuration を 3 系に合わせて変更する必要がある。

[Xdebug: Documentation » Xdebug 2 から 3 へのアップグレード](https://xdebug.org/docs/upgrade_guide/ja)

#### 最終的に設定した値

`php.ini`は警告メッセージにある通り、3 系の新しい設定値に修正した。

```/docker/php/Dockerfile
# 下記を追加

# XDebug
RUN pecl install xdebug \
  && docker-php-ext-enable xdebug
```

```/docker/php/php.ini
[xdebug]
xdebug.idekey="vscode"
xdebug.client_host = "host.docker.internal"
xdebug.mode="develop"
xdebug.mode="debug"
xdebug.start_with_request="yes"
xdebug.xdebug.discover_client_host = 0
xdebug.mode="debug"
xdebug.remote_handler = "dbgp"
xdebug.client_port = 9001
```

これで再度コンテナをビルドし直し、確認。

```bash
$ docker-compose exec app bash
root@a422c7a74095:/work/backend# php -v
PHP 8.0.0 (cli) (built: Dec  1 2020 03:33:03) ( NTS )
Copyright (c) The PHP Group
Zend Engine v4.0.0-dev, Copyright (c) Zend Technologies
    with Xdebug v3.0.3, Copyright (c) 2002-2021, by Derick Rethans
```

さっきの警告メッセージは表示されなくなった。

### VSCode 側の設定

サーバー側(Docker)の設定が完了したので、クライアント側(VSCode)を設定する。

**VSCode でエクステンションをインストール**

PHP Debug(robberphex.php-debug) をインストールする。

**.vscode/launch.json を編集**

```launch.json
{
  "version": "0.2.0",
  "configurations": [
      {
          "name": "Listen for XDebug",
          "type": "php",
          "request": "launch",
          "port": 9001,
          "pathMappings": {
              "/work/backend": "${workspaceRoot}/backend"
          }
      }
  ]
}
```

pathMappings の`"/work/backend"`は Docker 内の Laravel プロジェクトのあるディレクトリパス。`"${workspaceRoot}/backend"`は VSCode で Laravel プロジェクトのあるディレクトリパス。

port は php.ini で設定したポート番号と同じ値を設定。

これで、ブレイクポイントを設定し、デバッグ動くようになった。
