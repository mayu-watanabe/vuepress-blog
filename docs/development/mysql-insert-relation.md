---
title: "[MySQL]親子関係にある2つのテーブルにinsertしたい"
date: 2021-02-05
description: "親テーブルと、その親のIDをカラムにもつ子テーブルの2つのテーブルにトランザクションで一気にinsertしたい時。"
category: dev
tags: ["mysql"]
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## 目次

[[toc]]

## テーブル構造

### テーブル準備

```sql
CREATE TABLE `member` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `age` int(3) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `member_address` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `member_id` int(11) NOT NULL,
  `address` varchar(100) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_member_address_1` FOREIGN KEY (`member_id`) REFERENCES `member` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

member が親で、member_address は member.id を外部キーに持つような関係にある。

トランザクション内で 2 つのテーブルに一気に insert したい。

## SQL

```sql
BEGIN;

# 現在時刻をセット
SELECT @time := NOW();

# member へinsert
INSERT INTO
  member
SET
  name = 'TARO',
  age = 18,
  created_at = @time,
  updated_at = @time;

# memberのidを取得しセット
SELECT
  @member_id := id
FROM
  member
WHERE
  name = 'TARO'
  AND created_at = @time
  AND updated_at = @time;

# member_address へinsert
INSERT INTO
  member_address
SET
  member_id = @member_id,
  address = 'JAPAN',
  created_at = @time,
  updated_at = @time;

COMMIT;
```

### 実行結果

```sql
mysql> select * from member;
+----+------+-----+---------------------+---------------------+
| id | name | age | created_at          | updated_at          |
+----+------+-----+---------------------+---------------------+
|  2 | TARO |  18 | 2021-02-04 15:53:31 | 2021-02-04 15:53:31 |
+----+------+-----+---------------------+---------------------+
1 row in set (0.00 sec)

mysql> select * from member_address where member_id = 2;
+----+-----------+---------+---------------------+---------------------+
| id | member_id | address | created_at          | updated_at          |
+----+-----------+---------+---------------------+---------------------+
|  1 |         2 | JAPAN   | 2021-02-04 15:53:31 | 2021-02-04 15:53:31 |
+----+-----------+---------+---------------------+---------------------+
1 row in set (0.00 sec)
```

### ポイント

トランザクションの中で、親テーブルへ insert 後に insert されたレコードの ID を取得＆セットしている。
WHERE 句に入れるデータが一意でない場合や時刻カラムがない場合などは使えないかもしれない。
