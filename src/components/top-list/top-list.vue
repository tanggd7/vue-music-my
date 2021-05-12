<template>
  <transition appear name="slide-page">
    <music-list v-if="topListDetail"
                :title="topListDetail.name"
                :bg-image="topListDetail.bgImage"
                :song-list="topListDetail.songList"/>
  </transition>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getTopListDetail, ITopListDetail } from '@/api/rank'
import MusicList from '@/components/music-list/music-list.vue'

@Component({ components: { MusicList } })
export default class TopList extends Vue {
  private topListDetail: ITopListDetail | null = null

  private created (): void {
    const { id } = this.$route.params
    getTopListDetail(id).then((data) => {
      this.topListDetail = data
    })
  }
}
</script>

<style scoped lang="stylus">

</style>
