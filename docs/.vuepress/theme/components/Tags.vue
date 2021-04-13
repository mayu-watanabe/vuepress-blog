<template>
  <div>
    <h2># tags</h2>
    <span v-for="(tag, index) in tags" class="tags">
      <a v-bind:class="[{ selected: isSelected == index }, '']" @click="clicked(index)">{{ index }}</a>
    </span>
  </div>
</template>

<script>
export default {
  name: 'Tags',
  props: ['posts', 'filter', 'isSelected'],
  computed: {
    tags() {
      let tags = {};
      for (let page of this.$site.pages) {
        for (let tagIndex in page.frontmatter.tags) {
          const tag = page.frontmatter.tags[tagIndex];
          if (tag in tags) {
            tags[tag].push(page);
          } else {
            tags[tag] = [page];
          }
        }
      }
      let array = Object.keys(tags).map((k)=>({ key: k, value: tags[k] }));

      // 記事数が多い順に並び替え
      array.sort((a, b) =>  b.value.length - a.value.length);
      tags = Object.assign({}, ...array.map((item) => ({
          [item.key]: item.value,
      })));

      return tags;
    },

  },
  methods: {
    clicked(index) {
      const tagPosts = this.tags[index].sort(function(a, b) {
        if(a.frontmatter.date < b.frontmatter.date) return 1;
        if(a.frontmatter.date > b.frontmatter.date) return -1;
        return 0;
      }); 
      this.$emit('click-tag', index);
      this.filter(tagPosts, index);
    }
  }
}
</script>

<style lang="stylus">
.tags 
  a 
    display: inline-block;
    margin: 0 .2em .5em 0;
    padding: .5em;
    line-height: 1;
    letter-spacing: 0.05em;
    text-decoration: none !important;
    color: black;
    background-color: white;
    border: 1px solid black;

    &:before
      content: "#";	

    &:hover
      color: white;
      background-color: black;

    &.selected
      color: white;
      background-color: black
</style>