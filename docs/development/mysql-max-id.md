---
title: "[MySQL]1対多のテーブル構造でgorup byで取得する時に最新のレコードをJOINしたい"
date: 2021-01-31
description: "1対多のテーブル構造でgorup byで取得する時に最新のレコードをJOINしたい場合のSQL。"
category: dev
tags: ["mysql"]
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## 目次

[[toc]]

## テーブル構造

**order_settlement テーブル**

| id  | order_id | settlement_id | created_at          |
| --- | -------- | ------------- | ------------------- |
| 1   | 1        | 1             | 2020-12-01 12:22:54 |
| 2   | 1        | 2             | 2020-12-02 20:15:46 |
| 3   | 2        | 3             | 2020-12-02 23:22:51 |

**order テーブル**

| id  | order_number  |
| --- | ------------- |
| 1   | ABC2012020001 |
| 2   | ABC2012020002 |

**settlement テーブル**

| id  | amount_jpy |
| --- | ---------- |
| 1   | 200        |
| 2   | 300        |
| 3   | 500        |

1 つの注文番号(order)に対して、複数の決済情報(order_settlement)が存在する状態。最新の決済情報を JOIN して注文情報と一緒に取得したい場合。

## 取得したい形

| order_number  | settlement_id | amount_jpy | created_at          |
| ------------- | ------------- | ---------- | ------------------- |
| ABC2012020001 | 2             | 300        | 2020-12-02 20:15:46 |
| ABC2012020002 | 3             | 500        | 2020-12-02 23:22:51 |

## SQL

where 句で id を指定する際にサブクエリを使用し、同 order_id を持つ order_settlement レコードの中で、id が一番大きい値が取得されるよう指定している。max は指定列の最大値を求める関数。

```sql
SELECT
    o.order_number,
    os.settlement_id,
    s.amount_jpy,
    os.created_at
FROM
    order_settlement os
    INNER JOIN
        settlement s
    ON  s.id = os.settlement_id
    INNER JOIN
        order o
    ON  o.id = os.order_id
WHERE
    os.id IN(
        SELECT
            MAX(id)
        FROM
            order_settlement os2
        WHERE
            os2.order_id = o.id
    )
GROUP BY
    o.id
;
```
