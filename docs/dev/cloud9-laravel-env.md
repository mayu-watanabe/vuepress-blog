---
title: [AWS]Cloud9を使ったLaravel環境構築
date: 2021-01-31
description: Cloud9を使ったLaravel環境構築手順のメモ。
category: dev
tags: ['aws','cloud9','laravel']
---

# {{ $frontmatter.title }}

### AWSアカウントを作成する
Cloud９の利用は無料ですが、サーバーをたてるとサーバーの使用料がかかる。登録から12ヶ月間は自動で無料枠が付与されるので、詳しい料金は公式サイトを参考に。

### AWS Cloud 9上に新たな環境を作成
アカウントを作成したら、Cloud9で環境を作成。
1. create environmentをクリック
![](https://i.imgur.com/gA8370m.png)

2. Nameで適当に名前つけて、次に進む
![](https://i.imgur.com/OqsPLme.png)

3. Configure settingsはデフォルトのままでいいので、そのまま次へ進む
4. [create environment]を押して、環境が作成される。
5. 環境作成されると、こんな画面に。
![](https://i.imgur.com/HaCOMeg.png)
左側がフォルダ構成、ファイルクリックすると画面中央に表示されます（今AWS Cloud9と表示されているところ）。下にあるのがコマンド操作部分（ec2-user:~/environment $ と表示されているところ）。

次から、コマンドラインで環境構築していく。

### PHPのバージョンを7.1に上げる
PHPのバージョン確認。
```
$ php -v
PHP 5.6.40 (cli) (built: Oct 31 2019 20:35:16) 
Copyright (c) 1997-2016 The PHP Group
Zend Engine v2.6.0, Copyright (c) 1998-2016 Zend Technologies
    with Xdebug v2.5.5, Copyright (c) 2002-2017, by Derick Rethans
```
デフォルトのPHPのバージョンが5.6なので、7.1にあげる。下記のコマンドを実行。
```
$ sudo yum -y update
$ sudo yum -y install php71 php71-mbstring php71-pdo php71-intl php71-pdo_mysql php71-pdo_pgsql php71-xdebug php71-opcache php71-apcu
$ sudo unlink /usr/bin/php
$ sudo ln -s /etc/alternatives/php7 /usr/bin/php
```

↑2行目でmysqlのPDOドライバをインストールしている。
cloud9でのlaravel環境構築を紹介している記事で、エラーになる場合があって、それがこのドライバがインストールされていないのが原因だった。デフォルトだと、`pdo_sqlite`しか入っていない。
```
$ php -m | grep pdo #ドライバの確認
pdo_mysql
pdo_pgsql
pdo_sqlite
```

### Composerのインストール
```
$ curl -sS https://getcomposer.org/installer | php
$ sudo mv composer.phar /usr/local/bin/composer

$ composer #確認用：composerの大きな文字が表示されてればOK
```

### laravelのインストール
```
$ composer global require "laravel/installer"
```
メモリ不足でインストールができない時（composerコマンドでエラーになる）
https://qiita.com/takaaki-mizuno/items/fc1b9ef513609cab7eb9

### laravelプロジェクトの作成
```
$ composer create-project laravel/laravel [プロジェクト名]
```
バージョンを指定しない場合、最新バージョンで作成される。指定する場合は、プロジェクト名の後に例えば`5.5.*`などとつけて指定する。

```
ec2-user:~/environment $ ls
laravel-tdd  README.md
```
environment直下に、プロジェクト（laravel-tdd）が作成されている。

### mysqlのバージョンをあげる

```
ec2-user:~/environment $ mysql --version
mysql  Ver 14.14 Distrib 5.5.62, for Linux (x86_64) using readline 5.1
```
↑デフォルトだと5.5で、migrationでエラーになることがあるので、バージョンをあげる。下記コマンドを実行。

```
$ sudo service mysqld stop
$ sudo yum -y erase mysql-config mysql55-server mysql55-libs mysql55
$ sudo yum -y install mysql57-server mysql57
$ sudo service mysqld start
```

### mysqlでDBを作成する
mysqlにログイン。パスワードは空白のままでエンター。
```
ec2-user:~/environment $ mysql -uroot -p
Enter password: #空欄
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 4
Server version: 5.7.30 MySQL Community Server (GPL)

Copyright (c) 2000, 2020, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> 
```
プロジェクト用のDBを作成する。今回はsampleという名前で作成。

```
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
4 rows in set (0.01 sec)

mysql> create database sample;
Query OK, 1 row affected (0.00 sec)

mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sample             |
| sys                |
+--------------------+
5 rows in set (0.00 sec)
```
作成された。

### laravelの環境ファイルのDB設定を変更する
exitでmysqlから一旦ログアウト。プロジェクト下に移動し、`.env`という隠しファイルがあるので、それを編集する。

```
ec2-user:~/environment $ ls
laravel-tdd  README.md
ec2-user:~/environment $ cd laravel-tdd
ec2-user:~/environment/laravel-tdd $ ls -a
.    artisan        composer.lock  .editorconfig  .gitattributes  phpunit.xml  resources   storage       vendor
..   bootstrap      config         .env           .gitignore      public       routes      .styleci.yml  webpack.mix.js
app  composer.json  database       .env.example   package.json    readme.md    server.php  tests
```
![](https://i.imgur.com/iQgT17h.png)
ファイル構成欄の歯車マークをクリックすると、[show hidden files]という部分があるので、ここにチェックを入れると隠しファイルも表示される。`.env`ファイルを開く。

DBの設定のところを、下記のように書き換える。
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sample
DB_USERNAME=root
DB_PASSWORD=
```

保存したら、artisanコマンドでmigrateできるか確認してみる。

```
ec2-user:~/environment/laravel-tdd $ php artisan migrate
Migration table created successfully.
Migrating: 2014_10_12_000000_create_users_table
Migrated:  2014_10_12_000000_create_users_table (0.06 seconds)
Migrating: 2014_10_12_100000_create_password_resets_table
Migrated:  2014_10_12_100000_create_password_resets_table (0.03 seconds)
ec2-user:~/environment/laravel-tdd $ 
```
↑こんな感じで実行できれば、DBとの紐付けが成功している。先ほど作ったDBをみてみると、新しくテーブルが作成されている。
```
mysql> use sample
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
mysql> show tables;
+------------------+
| Tables_in_sample |
+------------------+
| migrations       |
| password_resets  |
| users            |
+------------------+
3 rows in set (0.01 sec)

mysql> 
```


最後に、ブラウザで表示確認してみる。まず、ローカルサーバーをたてて、

```
ec2-user:~/environment/laravel-tdd $ php artisan serve --port=8080
Laravel development server started: <http://127.0.0.1:8080>
```
[preview running application]をクリックすると、ブラウザが開きます。

![](https://i.imgur.com/iJ3pFR4.png)

laravelの画面が表示されてたらOK！
![](https://i.imgur.com/onfw0TF.png)


