<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box @on-query-change="onQueryChange" ref="searchBox"/>
    </div>
    <div v-show="!query" class="shortcut-wrapper" ref="shortcutWrapper">
      <scroll :data="shortcut" class="shortcut" ref="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li v-for="(item, index) in hotKey" :key="index" @click="addQuery(item)" class="item">
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>
      </scroll>
    </div>
    <div v-show="query" class="search-result" ref="searchResult">
      <list-view :data="searchList" @on-select="onSelect" :show-avatar="false" :show-shortcut="false" ref="searchList"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import SearchBox from '@/base/search-box/search-box.vue'
import { PlayListMixin } from '@/common/js/mixins'
import { ISong } from '@/common/js/type'
import { getSearchHotList, getSearchList } from '@/api/search'
import Scroll from '@/base/scroll/scroll.vue'
import ListView from '@/base/list-view/list-view.vue'
import { IListViewGroup, IListViewGroupItem } from '@/base/list-view/list-view'
import { getSongDetail } from '@/api/song'
import { Action } from 'vuex-class'

@Component({
  components: {
    ListView,
    Scroll,
    SearchBox
  }
})
export default class Search extends Mixins(PlayListMixin) {
  private query = ''
  private hotKey: Array<string> = []
  private searchList: Array<IListViewGroup> = []

  $refs!: {
    searchBox: SearchBox,
    shortcutWrapper: HTMLElement,
    shortcut: Scroll,
    searchResult: HTMLElement,
    searchList: ListView
  }

  @Action private insertSong!: (song: ISong) => void

  private get shortcut (): Array<string> {
    return this.hotKey
  }

  private created (): void {
    this.getHotKey()
  }

  protected handlePlayList (list: Array<ISong>): void {
    const bottom = list.length > 0 ? '60px' : ''

    this.$refs.searchResult.style.bottom = bottom
    this.$refs.searchList.refresh()

    this.$refs.shortcutWrapper.style.bottom = bottom
    this.$refs.shortcut.refresh()
  }

  private onQueryChange (query: string): void {
    this.query = query
    if (query) {
      getSearchList(query).then((data) => {
        this.searchList = data
      })
    } else {
      this.searchList = []
    }
  }

  private addQuery (query: string): void {
    this.$refs.searchBox.setQuery(query)
  }

  private onSelect (item: IListViewGroupItem): void {
    if (item.group === 'song') {
      getSongDetail(item.id).then((data) => {
        this.insertSong(data)
      })
    } else if (item.group === 'singer') {
      this.$router.push({ path: `/singer/${item.id}` })
    } else if (item.group === 'playList') {
      this.$router.push({ path: `/recommend/${item.id}` })
    }
  }

  private getHotKey (): void {
    getSearchHotList().then((data) => {
      this.hotKey = data
    })
  }
}
</script>

<style scoped lang="stylus">
.search
  .search-box-wrapper
    margin: 20px

  .shortcut-wrapper
    position: fixed
    top: 178px
    bottom: 0
    width: 100%

    .shortcut
      height: 100%
      overflow: hidden

      .hot-key
        margin: 0 20px 20px 20px

        .title
          margin-bottom: 20px
          font-size: $font-size-medium
          color: $color-text-l

        .item
          display: inline-block
          padding: 5px 10px
          margin: 0 20px 10px 0
          border-radius: 6px
          background: $color-highlight-background
          font-size: $font-size-medium
          color: $color-text-d

  .search-result
    position: fixed
    width: 100%
    top: 178px
    bottom: 0
</style>
