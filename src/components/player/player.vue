<template>
  <div v-show="sequenceList.length" class="player">
    <transition name="normal">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image" alt="">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.author"></h2>
        </div>
        <div class="middle">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image" alt="">
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="progress-wrapper">
            <span class="time time-l">{{ format(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percent-change="onProgressBarChange"/>
            </div>
            <span class="time time-r">{{ format(duration) }}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="iconMode" @click="changeMode"/>
            </div>
            <div class="icon i-left">
              <i class="icon-prev" @click="prev"/>
            </div>
            <div class="icon i-center">
              <i :class="playIcon" @click="togglePlay"/>
            </div>
            <div class="icon i-right">
              <i class="icon-next" @click="next"/>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"/>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img :class="cdCls" width="40" height="40" :src="currentSong.image" alt="">
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
    <audio :src="url" @canplay="onCanplay" @timeupdate="onTimeUpdate" @ended="onEnded" ref="audio"/>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { Getter, Mutation } from 'vuex-class'
import ProgressCircle from '@/base/progress-circle/progress-circle.vue'
import { ISong } from '@/common/js/type'
import { getSongUrl } from '@/api/song'
import { SET_FULL_SCREEN } from '@/store'
import PlayList from '@/components/play-list/play-list.vue'
import { playMode } from '@/common/js/config'
import ProgressBar from '@/base/progress-bar/progress-bar.vue'
import { PlayerMixin } from '@/common/js/mixins'

@Component({
  components: {
    PlayList,
    ProgressCircle,
    ProgressBar
  }
})
export default class Player extends Mixins(PlayerMixin) {
  private url = ''
  private currentTime = 0
  private duration = 0
  private playReady = false

  $refs!: {
    audio: HTMLAudioElement,
    playList: PlayList
  }

  @Getter private playing!: boolean
  @Getter private fullScreen!: boolean
  @Getter private currentIndex!: number

  @Mutation(SET_FULL_SCREEN) private setFullScreen!: (flag: boolean) => void

  private get playIcon (): string {
    return this.playing ? 'icon-pause' : 'icon-play'
  }

  private get cdCls (): string {
    return this.playing ? 'play' : 'play pause'
  }

  private get miniIcon (): string {
    return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
  }

  private get percent (): number {
    return !this.currentTime ? 0 : this.currentTime / this.duration
  }

  private back (): void {
    this.setFullScreen(false)
  }

  private open (): void {
    this.setFullScreen(true)
  }

  private resetPlay (): void {
    this.$refs.audio.currentTime = 0
    this.$refs.audio.play()
    this.setPlayingState(true)
  }

  private format (interval: number): string {
    interval = interval | 0
    const minute = interval / 60 | 0
    let second = (interval % 60).toString()
    const len = second.length
    if (len < 2) second = '0' + second
    return `${minute}:${second}`
  }

  private onProgressBarChange (percent: number): void {
    this.$refs.audio.currentTime = this.duration * percent
    if (!this.playing) {
      this.togglePlay()
    }
  }

  private prev (): void {
    if (!this.playReady) {
      return
    }
    if (this.sequenceList.length === 1) {
      this.resetPlay()
      return
    } else {
      let index = this.currentIndex - 1
      if (index === -1) {
        index = this.sequenceList.length - 1
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlay()
      }
    }
    this.playReady = false
  }

  private next (): void {
    if (!this.playReady) {
      return
    }
    if (this.sequenceList.length === 1) {
      this.resetPlay()
      return
    } else {
      let index = this.currentIndex + 1
      if (index === this.sequenceList.length) {
        index = 0
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlay()
      }
    }
    this.playReady = false
  }

  private onCanplay (): void {
    this.playReady = true
    this.duration = this.$refs.audio.duration
  }

  private onTimeUpdate (e: any): void {
    this.currentTime = e.target.currentTime
  }

  private onEnded (): void {
    if (this.mode === playMode.loop) {
      this.resetPlay()
      return
    }
    this.next()
  }

  private togglePlay (): void {
    this.setPlayingState(!this.playing)
  }

  private showPlayList (): void {
    this.$refs.playList.show()
  }

  @Watch('currentSong', { immediate: false })
  private onCurrentSongChange (song: ISong, oldSong: ISong): void {
    if (!song.id) {
      this.url = ''
      return
    }
    if (song.id === oldSong.id) {
      return
    }
    getSongUrl(song.id).then((url) => {
      if (!url) {
        this.playReady = true
        this.next()
        return
      }
      this.url = url
      this.$nextTick(() => {
        this.resetPlay()
      })
    })
  }

  @Watch('playing', { immediate: false })
  private onPlayingChange (playing: boolean): void {
    // 播放器已准备才进行下面的操作
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
  .normal-player
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 150
    background: $color-background

    &.normal-enter-active, &.normal-leave-active
      transition: all 0.4s

      .top, .bottom
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)

    &.normal-enter, &.normal-leave-to
      opacity: 0

      .top
        transform: translate3d(0, -100px, 0)

      .bottom
        transform: translate3d(0, 100px, 0)

    .background
      position: absolute
      left: 0
      top: 0
      width: 100%
      height: 100%
      z-index: -1
      opacity: 0.6
      filter: blur(20px)

    .top
      position: relative
      margin-bottom: 25px

      .back
        position absolute
        top: 0
        left: 6px
        z-index: 50

        .icon-back
          display: block
          padding: 9px
          font-size: $font-size-large-x
          color: $color-theme
          transform: rotate(-90deg)

      .title
        width: 70%
        margin: 0 auto
        line-height: 40px
        text-align: center
        no-wrap()
        font-size: $font-size-large
        color: $color-text

      .subtitle
        line-height: 20px
        text-align: center
        font-size: $font-size-medium
        color: $color-text

    .middle
      position: fixed
      width: 100%
      top: 80px
      bottom: 170px
      white-space: nowrap
      font-size: 0

      .middle-l
        display: inline-block
        vertical-align: top
        position: relative
        width: 100%
        height: 0
        padding-top: 80%

        .cd-wrapper
          position: absolute
          left: 10%
          top: 0
          width: 80%
          height: 100%

          .cd
            width: 100%
            height: 100%
            box-sizing: border-box
            border: 10px solid rgba(255, 255, 255, 0.1)
            border-radius: 50%

            &.play
              animation: rotate 20s linear infinite

            &.pause
              animation-play-state: paused

            .image
              position: absolute
              left: 0
              top: 0
              width: 100%
              height: 100%
              border-radius: 50%

    .bottom
      position: absolute
      bottom: 50px
      width: 100%

      .progress-wrapper
        display: flex
        align-items: center
        width: 80%
        margin: 0 auto
        padding: 10px 0

        .time
          color: $color-text
          font-size: $font-size-small
          flex: 0 0 30px
          line-height: 30px
          width: 30px

          &.time-l
            text-align: left

          &.time-r
            text-align: right

        .progress-bar-wrapper
          flex: 1

      .operators
        display: flex
        align-items: center

        .icon
          flex: 1
          color: $color-theme

          &.disable
            color: $color-theme-d

          i
            font-size: 30px

        .i-left
          text-align: right

        .i-center
          padding: 0 20px
          text-align: center

          i
            font-size: 40px

        .i-right
          text-align: left

        .icon-favorite
          color: $color-sub-theme

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
