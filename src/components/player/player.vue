<template>
  <div v-show="playList.length" class="player">
    <transition name="mini">
      <div class="mini-player">
        <div class="icon">
          <img :class="miniCdCls" width="40" height="40" :src="currentSong.image" alt="">
        </div>
        <div class="text">
          <h2 class="name">{{ currentSong.name }}</h2>
          <p class="desc">{{ currentSong.author }}</p>
        </div>
        <div class="control">
          <progress-circle :radius="32" :percent="percent">
            <i class="icon-mini" :class="miniIcon" @click.stop="togglePlay"/>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist" @click.stop="showPlayList"/>
        </div>
      </div>
    </transition>
    <play-list ref="playList"/>
    <audio v-if="url" :src="url" @canplay="onCanplay" @timeupdate="onTimeUpdate" @ended="onEnded" ref="audio"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Getter, Mutation } from 'vuex-class'
import ProgressCircle from '@/base/progress-circle/progress-circle.vue'
import { ISong } from '@/common/js/type'
import { getSongUrl } from '@/api/song'
import { SET_PLAYING_STATE } from '@/store'
import PlayList from '@/components/play-list/play-list.vue'

@Component({
  components: {
    PlayList,
    ProgressCircle
  }
})
export default class Player extends Vue {
  private url = ''
  private currentTime = 0
  private playReady = false

  $refs!: {
    audio: HTMLAudioElement,
    playList: PlayList
  }

  @Getter private playing!: number
  @Getter private playList!: Array<ISong>
  @Getter private currentIndex!: number
  @Getter private currentSong!: ISong

  @Mutation(SET_PLAYING_STATE) private setPlayingState!: (flag: boolean) => void

  private get miniCdCls (): string {
    return this.playing ? 'play' : 'play pause'
  }

  private get miniIcon (): string {
    return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
  }

  private get percent (): number {
    return !this.currentTime ? 0 : this.currentTime / this.$refs.audio.duration
  }

  private resetPlay (): void {
    this.$refs.audio.currentTime = 0
    this.$refs.audio.play()
  }

  private onCanplay (): void {
    this.playReady = true
  }

  private onTimeUpdate (e: any): void {
    this.currentTime = e.target.currentTime
  }

  private onEnded (): void {
    this.$refs.audio.currentTime = 0
    this.togglePlay()
  }

  private togglePlay (): void {
    this.setPlayingState(!this.playing)
  }

  private showPlayList (): void {
    this.$refs.playList.show()
  }

  @Watch('currentSong', { immediate: true })
  private onCurrentSongChange (song: ISong): void {
    if (!song.id) {
      return
    }
    getSongUrl(song.id).then((url) => {
      this.url = url
      this.$nextTick(() => {
        this.resetPlay()
      })
    })
  }

  @Watch('playing', { immediate: true })
  private onPlayingChange (playing: boolean): void {
    if (!this.playReady) {
      return
    }
    const audio = this.$refs.audio
    this.$nextTick(() => {
      playing ? audio.play() : audio.pause()
    })
  }
}
</script>

<style scoped lang="stylus">
.player
  .mini-player
    display: flex
    align-items: center
    position: fixed
    left: 0
    bottom: 0
    z-index: 180
    width: 100%
    height: 60px
    background: $color-highlight-background

    &.mini-enter-active, &.mini-leave-active
      transition: all 0.4s

    &.mini-enter, &.mini-leave-to
      opacity: 0

    .icon
      flex: 0 0 40px
      width: 40px
      padding: 0 10px 0 20px

      img
        border-radius: 50%

        &.play
          animation: rotate 10s linear infinite

        &.pause
          animation-play-state: paused

    .text
      display: flex
      flex-direction: column
      justify-content: center
      flex: 1
      line-height: 20px
      overflow: hidden

      .name
        margin-bottom: 2px
        no-wrap()
        font-size: $font-size-medium
        color: $color-text

      .desc
        no-wrap()
        font-size: $font-size-small
        color: $color-text-d

    .control
      flex: 0 0 30px
      width: 30px
      padding: 0 10px

      .icon-play-mini, .icon-pause-mini, .icon-playlist
        font-size: 30px
        color: $color-theme-d

      .icon-mini
        font-size: 32px
        position: absolute
        left: 0
        top: 0

@keyframes rotate
  0%
    transform: rotate(0)
  100%
    transform: rotate(360deg)
</style>
