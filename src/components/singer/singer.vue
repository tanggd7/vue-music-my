<template>
  <div class="singer">
    <list-view :data="singerList"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getSingerList, singer } from '@/api/singer'
import { listViewGroup, listViewGroupItem } from '@/base/list-view/list-view'
import ListView from '@/base/list-view/list-view.vue'

interface groupMap {
  [propName: string]: listViewGroup;
}

@Component({
  components: { ListView }
})
export default class Singer extends Vue {
  private singerList: Array<listViewGroup> = []

  private created (): void {
    getSingerList().then((data) => {
      this.singerList = this.normalizeSinger(data)
    })
  }

  private normalizeSinger (list:Array<singer>): Array<listViewGroup> {
    const map: groupMap = {}
    list.forEach((item: singer) => {
      const key: string = item.sIndex
      if (!map[key]) {
        map[key] = {
          title: key,
          items: []
        }
      }
      const { items } = map[key]
      const obj: listViewGroupItem & singer = { avatar: item.picUrl, ...item }
      items.push(obj)
    })
    const ret: Array<listViewGroup> = []
    Object.keys(map).forEach((key) => {
      const val = map[key]
      ret.push(val)
    })
    ret.sort((a: listViewGroup, b: listViewGroup) => {
      return a.title.charCodeAt(0) - b.title.charCodeAt(0)
    })
    return ret
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
