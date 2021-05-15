<template>
  <transition name="list-fade">
    <div class="play-list" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <span class="text">{{ modeText }}</span>
            <span class="clear" @click="clearList"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <scroll :data="sequenceList" class="list-content" ref="listContent">
          <transition-group ref="list" name="list" tag="ul">
            <li v-for="(item, index) in sequenceList" :key="item.id" class="item" @click="selectSong(item, index)">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{ item.name }}</span>
              <!--              <span class="like">-->
              <!--                <i class="icon-not-favorite"></i>-->
              <!--              </span>-->
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <!--        <div class="list-operate">-->
        <!--          <div class="add">-->
        <!--            <i class="icon-add"/>-->
        <!--            <span class="text">添加歌曲到队列</span>-->
        <!--          </div>-->
        <!--        </div>-->
        <div @click="hide" class="list-close">
          <span>关闭</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { Action } from 'vuex-class'
import { ISong } from '@/common/js/type'
import Scroll from '@/base/scroll/scroll.vue'
import { playMode } from '@/common/js/config'
import { PlayerMixin } from '@/common/js/mixins'

@Component({
  components: { Scroll }
})
export default class PlayList extends Mixins(PlayerMixin) {
  private showFlag = false

  @Action private clearSongList!: () => void
  @Action private deleteSong!: (song: ISong) => void

  $refs!: {
    listContent: Scroll
  }

  private get modeText (): string {
    return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环'
  }

  public show (): void {
    this.showFlag = true
    this.$nextTick(() => {
      this.$refs.listContent.refresh()
    })
  }

  private hide (): void {
    this.showFlag = false
  }

  private clearList (): void {
    this.clearSongList()
    this.hide()
  }

  private getCurrentIcon (song: ISong): string {
    return this.currentSong.id === song.id ? 'icon-play' : ''
  }

  private selectSong (song: ISong, index: number): void {
    this.setCurrentIndex(index)
    this.setPlayingState(true)
  }

  private deleteOne (song: ISong): void {
    this.deleteSong(song)
    if (!this.playList.length) {
      this.hide()
    }
  }
}
</script>

<style scoped lang="stylus">
.play-list
  position: fixed
  left: 0
  right: 0
  top: 0
  bottom: 0
  z-index: 200
  background-color: $color-background-d

  &.list-fade-enter-active, &.list-fade-leave-active
    transition: opacity 0.3s

    .list-wrapper
      transition: all 0.3s

  &.list-fade-enter, &.list-fade-leave-to
    opacity: 0

    .list-wrapper
      transform: translate3d(0, 100%, 0)

  &.list-fade-enter
  .list-wrapper
    position: absolute
    left: 0
    bottom: 0
    width: 100%
    background-color: $color-highlight-background

    .list-header
      position: relative
      padding: 20px 30px 10px 20px

      .title
        display: flex
        align-items: center

        .icon
          margin-right: 10px
          font-size: 30px
          color: $color-theme-d

        .text
          flex: 1
          font-size: $font-size-medium
          color: $color-text-l

        .clear
          extend-click()

          .icon-clear
            font-size: $font-size-medium
            color: $color-text-d

    .list-content
      max-height: 240px
      overflow: hidden

      .item
        display: flex
        align-items: center
        height: 40px
        padding: 0 30px 0 20px
        overflow: hidden

        &.list-enter-active, &.list-leave-active
          transition: all 0.1s

        &.list-enter, &.list-leave-to
          height: 0

        .current
          flex: 0 0 20px
          width: 20px
          font-size: $font-size-small
          color: $color-theme-d

        .text
          flex: 1
          no-wrap()
          font-size: $font-size-medium
          color: $color-text-d

        .like
          extend-click()
          margin-right: 15px
          font-size: $font-size-small
          color: $color-theme

          .icon-favorite
            color: $color-sub-theme

        .delete
          extend-click()
          font-size: $font-size-small
          color: $color-theme

    .list-operate
      width: 140px
      margin: 20px auto 30px auto

      .add
        display: flex
        align-items: center
        padding: 8px 16px
        border: 1px solid $color-text-l
        border-radius: 100px
        color: $color-text-l

        .icon-add
          margin-right: 5px
          font-size: $font-size-small-s

        .text
          font-size: $font-size-small

    .list-close
      text-align: center
      line-height: 50px
      background: $color-background
      font-size: $font-size-medium-x
      color: $color-text-l
</style>
