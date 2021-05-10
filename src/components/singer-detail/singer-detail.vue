<template>
  <transition appear name="slide-page">
    <music-list v-if="detail"
                :title="detail.name"
                :bg-image="detail.bgImage"
                :song-list="songList"/>
  </transition>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import MusicList from '../music-list/music-list.vue'
import { getSingerDetail, getSingerDetailSong, ISingerDetail } from '@/api/singer'
import { ISong } from '@/common/js/type'

@Component({ components: { MusicList } })
export default class SingerDetail extends Vue {
  private detail?: ISingerDetail | null = null
  private songList?: Array<ISong> = []

  private created (): void {
    const { id } = this.$route.params
    Promise.all([
      getSingerDetail(id),
      getSingerDetailSong(id)
    ]).then(([detail, songList]) => {
      this.detail = detail
      this.songList = songList
    })
  }
}
</script>

<style scoped>

</style>
