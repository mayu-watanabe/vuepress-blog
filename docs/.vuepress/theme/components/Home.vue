<template>
  <main
    class="home"
    :aria-labelledby="data.heroText !== null ? 'main-title' : null"
  >
    <header class="hero">
      <h1
        v-if="data.heroText !== null"
        id="main-title"
      >
        {{ data.heroText || $title || 'Hello' }}
      </h1>

      <p
        v-if="data.actionText && data.actionLink"
        class="action"
      >
        <NavLink
          class="action-button"
          :item="actionLink"
        />
      </p>
    </header>

    <div
      v-if="data.features && data.features.length"
      class="features"
    >
      <div
        v-for="(feature, index) in data.features"
        :key="index"
        class="feature"
      >
        <h2 @click="home">{{ feature.title }}</h2>
        <p>{{ feature.details }}</p>
      </div>
    </div>

    <div class="theme-default-content">
      <Tags :filter="filter" :posts="posts" />
      <h2>{{ selectedTag }}</h2>
      <div v-for="(post, index) in posts" class="post">
        <span>{{ date(post.frontmatter.date) }}</span>
        <a :href="post.regularPath"><h3>{{ post.title }}</h3></a>
        <p>{{ post.frontmatter.description }}</p>
      </div>
    </div>

    <div
      v-if="data.footer"
      class="footer"
    >
      {{ data.footer }}
    </div>
  </main>
</template>

<script>
import NavLink from '@theme/components/NavLink.vue'
import Tags from '@theme/components/Tags.vue'
import { getNowDateWithString } from '../util'

export default {
  name: 'Home',

  components: { NavLink, Tags },

  data() {
    return {
      posts: [],
      selectedTag: '# posts'
    }
  },

  mounted() {
    this.posts = this.$site.pages.filter(post => {
      let filename = post.relativePath.match(/([^/]+)\./)[1];
      return filename != 'README';
      })
      .sort(function(a, b) {
        if(a.frontmatter.date < b.frontmatter.date) return 1;
        if(a.frontmatter.date > b.frontmatter.date) return -1;
        return 0;
      }); 
  },

  computed: {
    data () {
      return this.$page.frontmatter
    },

    actionLink () {
      return {
        link: this.data.actionLink,
        text: this.data.actionText
      }
    },

    date: function() {
      return function(date) {
        var timestamp = Date.parse(date);
        return getNowDateWithString(timestamp);
      }
    },

    filterPosts: {
      get: function() {
        return this.posts;
      },
      set: function(value) {
        this.posts = value;
      }
    },
  },

  methods: {
    filter (value, index) {
      this.selectedTag = '# ' + index;
      this.$set(this, 'posts', value);
    },
  }
}
</script>

<style lang="stylus">
.post
  padding 1rem 0
  h3 
    font-size: 1.2em
.home
  padding $navbarHeight 2rem 0
  max-width $homePageWidth
  margin 0px auto
  display block
  .hero
    text-align center
    #main-title
      margin-top 6.8rem
    img
      max-width: 100%
      max-height 280px
      display block
      margin 3rem auto 1.5rem
    h1
      font-size 3rem
      font-family $fontFamilyTitle
      letter-spacing 0.4rem
    h1, .description, .action
      margin 1.8rem auto
    .description
      max-width 35rem
      font-size 1.6rem
      line-height 1.3
      color lighten($textColor, 40%)
    .action-button
      display inline-block
      font-size 1.2rem
      color #fff
      background-color $accentColor
      padding 0.8rem 1.6rem
      border-radius 4px
      transition background-color .1s ease
      box-sizing border-box
      border-bottom 1px solid darken($accentColor, 10%)
      &:hover
        background-color lighten($accentColor, 10%)
  .features
    border-top 1px solid $borderColor
    padding 1.2rem 0
    margin-top 2.5rem
    display flex
    flex-wrap wrap
    align-items flex-start
    align-content stretch
    justify-content space-between
  .feature
    flex-grow 1
    flex-basis 30%
    max-width 30%
    h2
      font-size 1.4rem
      font-weight 500
      border-bottom none
      padding-bottom 0
      color lighten($textColor, 10%)
    p
      color lighten($textColor, 25%)
  .footer
    padding 2.5rem
    border-top 1px solid $borderColor
    text-align center
    color lighten($textColor, 25%)

@media (max-width: $MQMobile)
  .home
    .features
      flex-direction column
    .feature
      max-width 100%
      padding 0 2.5rem

@media (max-width: $MQMobileNarrow)
  .home
    padding-left 1.5rem
    padding-right 1.5rem
    .hero
      img
        max-height 210px
        margin 2rem auto 1.2rem
      h1
        font-size 2rem
      h1, .description, .action
        margin 1.2rem auto
      .description
        font-size 1.2rem
      .action-button
        font-size 1rem
        padding 0.6rem 1.2rem
    .feature
      h2
        font-size 1.25rem
</style>
