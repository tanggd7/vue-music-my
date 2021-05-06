<template>
  <transition appear name="slide-page">
    <music-list v-if="discDetail"
                :title="discDetail.name"
                :bg-image="discDetail.bgImage"
                :song-list="discDetail.songList"/>
  </transition>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import MusicList from '@/base/music-list/music-list.vue'
import { getDiscDetail, IDiscDetail } from '@/api/recommend'

@Component({ components: { MusicList } })
export default class Disc extends Vue {
  private discDetail?: IDiscDetail | null = null

  private created (): void {
    const { id } = this.$route.params
    getDiscDetail(id).then((data) => {
      this.discDetail = data
    })
  }
}
</script>

<style scoped lang="stylus">
</style>
