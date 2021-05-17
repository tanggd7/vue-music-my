<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="query" v-model="query" class="box" :placeholder="placeholder"/>
    <i @click="clear" v-show="query" class="icon-dismiss"></i>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'
import { debounce } from '@/common/js/util'

@Component
export default class SearchBox extends Vue {
  @Prop({ default: '搜索歌曲、歌手' }) private placeholder!: string

  private query = ''

  $refs!: {
    query: HTMLInputElement
  }

  private created (): void {
    this.$watch('query', debounce((newQuery: string) => {
      this.onQueryChange(newQuery)
    }, 200))
  }

  private clear (): void {
    this.query = ''
  }

  public setQuery (query: string): void {
    this.query = query
  }

  private blur (): void {
    this.$refs.query.blur()
  }

  @Emit()
  private onQueryChange (str: string): string {
    return str
  }
}
</script>

<style scoped lang="stylus">
.search-box
  display: flex
  align-items: center
  box-sizing: border-box
  width: 100%
  padding: 0 6px
  height: 40px
  background: $color-highlight-background
  border-radius: 6px

  .icon-search
    font-size: 24px
    color: $color-background

  .box
    flex: 1
    margin: 0 5px
    line-height: 18px
    background: $color-highlight-background
    color: $color-text
    font-size: $font-size-medium

    &::placeholder
      color: $color-text-d

  .icon-dismiss
    font-size: 16px
    color: $color-background
</style>
