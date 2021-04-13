#!/bin/bash
targetDir=/Users/mayuwatanabe/workspace/documents/dev-blog/docs

# script for create markdown post file
# frontmatter format below
# ---
# title: VuePressマークダウン記法メモ
# date: 2021-01-01
# description: ディスクリプション
# category: dev
# tags: []
# ---
# # {{ $frontmatter.title }}
#
# {{ $frontmatter.description }}
# 
# ## 目次
#
# [[toc]]

# ファイルを作成するディレクトリ一覧
DIR_LIST="frontend backend daily 3dcg"

echo "which directory? "
select DIR in $DIR_LIST
do
  if [ $DIR ]; then
    echo $DIR
    break
  else
    echo "invalid value"
  fi
done

# ファイル名
while :
do
  read -p "filename? " FILENAME
  if [ -z "$FILENAME" ]; then
    echo "please input"
  else 
    FILENAME=${FILENAME%.*} # 拡張子が入力された場合削除
    echo "${FILENAME}.md"
    break
  fi
done

# 投稿タイトル
read -p "title? " TITLE

# 日付
read -p "date? (format: 2021-03-10, without input will be today's date) " DATE
if [ -z "$DATE" ]; then
  DATE=`date '+%F'` # 空値の場合、今日の日付を取得
fi

# 要約
read -p "description? " DISCRIPTION

# カテゴリー
read -p "category? " CATEGORY

# ファイル作成
FILEPATH="${targetDir}/${DIR}/${FILENAME}.md"
{
echo "---"
echo "title: \"${TITLE}\""
echo "date: ${DATE}"
echo "description: \"${DISCRIPTION}\""
echo "category: ${CATEGORY}"
echo "tags: []"
echo "---"
echo 
echo "# {{ \$frontmatter.title }}"
echo 
echo "{{ \$frontmatter.description }}"
echo 
echo "## 目次"
echo 
echo "[[toc]]"
} > $FILEPATH

echo "created! ${FILEPATH}"


