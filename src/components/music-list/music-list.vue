<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"/>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div v-show="songList.length" class="play-wrapper">
        <div class="play" ref="playBtn">
          <i class="icon-play"/>
          <span class="text">随机播放全部</span>
        </div>
      </div>
    </div>
    <div class="bg-layer" ref="layer"/>
    <scroll :data="songList" class="list" :probe-type="3" :listen-scroll="true" @scroll="onListScroll" ref="list">
      <div class="song-list-wrapper" ref="listWrapper">
        <ul>
          <li v-for="(song, index) in songList" :key="song.id" class="item" @click="selectSong(index)">
            <div class="content">
              <h2 class="name">{{ song.name }}</h2>
              <p class="desc">{{ song.author }}</p>
            </div>
          </li>
        </ul>
      </div>
    </scroll>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { Action } from 'vuex-class'
import Scroll from '@/base/scroll/scroll.vue'
import { IPosition } from '@/base/scroll/scroll'
import { ISong } from '@/common/js/type'
import { PlayListMixin } from '@/common/js/mixins'

const RESERVED_HEIGHT = 40 // 顶部预留高度
const MAX_OFFSET_SCROLL_Y = -220 // 向上滚动的最大偏移

@Component({ components: { Scroll } })
export default class MusicList extends Mixins(PlayListMixin) {
  @Prop() private title!: string
  @Prop() private bgImage!: string
  @Prop({ default: () => [] }) private songList!: Array<ISong>

  @Action private selectPlay!: (p: any) => void

  $refs!: {
    bgImage: HTMLElement,
    playBtn: HTMLElement,
    layer: HTMLElement,
    list: Scroll
  }

  private get bgStyle (): string {
    return `background-image:url(${this.bgImage})`
  }

  protected handlePlayList (list: Array<ISong>): void {
    (this.$refs.list.$el as HTMLElement).style.bottom = list.length > 0 ? '60px' : ''
    this.$refs.list.refresh()
  }

  private back (): void {
    this.$router.back()
  }

  private onListScroll (position: IPosition): void {
    const y = position.y
    this.$refs.layer.style.transform = `translate3d(0,${Math.max(MAX_OFFSET_SCROLL_Y, y)}px,0)`
    if (y < MAX_OFFSET_SCROLL_Y) {
      this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
      this.$refs.bgImage.style.zIndex = '10'
      this.$refs.playBtn.style.display = 'none'
    } else {
      this.$refs.bgImage.style.height = '260px'
      this.$refs.bgImage.style.zIndex = '0'
      this.$refs.playBtn.style.display = ''
    }
  }

  private selectSong (index: number): void {
    this.selectPlay({
      list: this.songList,
      index
    })
  }
}
</script>

<style scoped lang="stylus">
.music-list
  position: fixed
  z-index: 100
  top: 0
  left: 0
  bottom: 0
  right: 0
  background: $color-background

  .back
    position absolute
    top: 0
    left: 6px
    z-index: 50

    .icon-back
      display: block
      padding: 10px
      font-size: $font-size-large-x
      color: $color-theme

  .title
    position: absolute
    top: 0
    left: 10%
    z-index: 40
    width: 80%
    no-wrap()
    text-align: center
    line-height: 40px
    font-size: $font-size-large
    color: $color-text

  .bg-image
    position: relative
    width: 100%
    height: 260px
    //padding-top: 70%
    transform-origin: top
    background-size: cover

    .play-wrapper
      position: absolute
      bottom: 20px
      width: 100%

      .play
        box-sizing: border-box
        width: 135px
        padding: 7px 0
        margin: 0 auto
        text-align: center
        border: 1px solid $color-theme
        color: $color-theme
        border-radius: 100px
        font-size: 0

        .icon-play
          display: inline-block
          vertical-align: middle
          margin-right: 6px
          font-size: $font-size-medium-x

        .text
          display: inline-block
          vertical-align: middle
          font-size: $font-size-small

  .bg-layer
    position: relative
    height: 100%
    background: $color-background

  .list
    position: absolute
    top: 260px
    bottom: 0
    width: 100%
    background: $color-background

    .song-list-wrapper
      padding: 20px 30px

      .item
        display: flex
        align-items: center
        box-sizing: border-box
        height: 64px
        font-size: $font-size-medium

        .content
          flex: 1
          line-height: 20px
          overflow: hidden

          .name
            no-wrap()
            color: $color-text

          .desc
            no-wrap()
            margin-top: 4px
            color: $color-text-d
</style>
