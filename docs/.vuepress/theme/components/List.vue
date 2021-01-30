<template>
  <main class="page">
    <slot name="top" />
    <Content class="theme-default-content" />
    <div class="list">
      <div v-for="(item, i) in posts" class="list-item">
      <a v-bind:href="item.path">{{item.title}}</a>
      </div>
    </div>
    <slot name="bottom" />
  </main>
</template>

<script>
export default {
  computed: {
    posts() {
      return this.$site.pages
      // ディレクトリ以下を投稿記事一覧表示の対象とする
      .filter(post => post.path.startsWith(this.$page.path))
      .filter(post => !post.frontmatter.hideList)
      // dateに設定した日付の降順にソートする
      .sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));
    }
  }
}
</script>

<style lang="stylus">
@require '../styles/wrapper.styl'

.page
  padding-bottom 2rem
  display block

.list 
  max-width: 740px
  margin: 0 auto
  padding: 2rem 2.5rem

.list-item {
  padding: 0.4rem
}
</style>
