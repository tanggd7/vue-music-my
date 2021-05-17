<template>
  <div class="singer" ref="singer">
    <list-view :data="singerList" @on-select="onSingerSelect" ref="list"/>
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { getSingerList, ISinger } from '@/api/singer'
import { IListViewGroup, IListViewGroupItem } from '@/base/list-view/list-view'
import ListView from '@/base/list-view/list-view.vue'
import { PlayListMixin } from '@/common/js/mixins'
import { ISong } from '@/common/js/type'

interface groupMap {
  [propName: string]: IListViewGroup;
}

@Component({
  components: { ListView }
})
export default class Singer extends Mixins(PlayListMixin) {
  private singerList: Array<IListViewGroup> = []

  $refs!: {
    singer: HTMLElement,
    list: ListView
  }

  created (): void {
    getSingerList().then((data) => {
      this.singerList = this.normalizeSinger(data)
    })
  }

  protected handlePlayList (list: Array<ISong>): void {
    this.$refs.singer.style.bottom = list.length > 0 ? '60px' : ''
    this.$refs.list.refresh()
  }

  private normalizeSinger (list: Array<ISinger>): Array<IListViewGroup> {
    const map: groupMap = {}
    list.forEach((item: ISinger) => {
      const key: string = item.sIndex
      if (!map[key]) {
        map[key] = {
          title: key,
          items: []
        }
      }
      const { items } = map[key]
      const obj: IListViewGroupItem & ISinger = { avatar: item.picUrl, ...item, group: key }
      items.push(obj)
    })
    const ret: Array<IListViewGroup> = []
    Object.keys(map).forEach((key) => {
      const val = map[key]
      ret.push(val)
    })
    ret.sort((a: IListViewGroup, b: IListViewGroup) => {
      return a.title.charCodeAt(0) - b.title.charCodeAt(0)
    })
    return ret
  }

  private onSingerSelect (item: IListViewGroupItem): void {
    this.$router.push({ path: `/singer/${item.id}` })
  }
}
</script>

<style scoped lang="stylus">
.singer
  position: fixed
  top: 88px
  bottom: 0
  width: 100%
</style>
