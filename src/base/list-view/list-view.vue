<template>
  <scroll v-if="data.length" class="list-view" ref="listView">
    <ul>
      <li v-for="(group, index) in data" :key="index" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{ group.title }}</h2>
        <uL>
          <li v-for="(item, index) in group.items" :key="index" class="list-group-item">
            <img class="avatar" :src="item.avatar" alt="">
            <span class="name">{{ item.name }}</span>
          </li>
        </uL>
      </li>
    </ul>
    <div class="list-shortcut"
         @touchstart.stop.prevent="onShortcutTouchStart"
         @touchmove.stop.prevent="onShortcutTouchMove"
         @touchend.stop>
      <ul>
        <li v-for="(item, index) in shortcutList" :key="index" :data-index="index" class="item"
            :class="{ 'current': currentIndex === index }">
          {{ item }}
        </li>
      </ul>
    </div>
  </scroll>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import scroll from '@/base/scroll/scroll.vue'
import { listViewGroup } from './list-view'
import { getData } from '@/common/js/dom'

interface touch {
  anchorIndex: number,
  y1: number,
  y2: number
}

const ANCHOR_HEIGHT = 18

@Component({
  components: {
    scroll
  }
})
export default class ListView extends Vue {
  @Prop() private data!: Array<listViewGroup>

  private currentIndex = 0
  private touch: touch = { anchorIndex: 0, y1: -1, y2: -1 }

  private get shortcutList (): Array<string> {
    return this.data.map(item => item.title?.substr(0, 1))
  }

  private onShortcutTouchStart (e: TouchEvent & Element): void {
    const anchorIndex = getData(e.target as Element, 'index') || '0'
    const firstTouch = e.touches[0]
    this.touch.y1 = firstTouch.pageY
    this.touch.anchorIndex = parseInt(anchorIndex)
    this.scrollTo(this.touch.anchorIndex)
  }

  private onShortcutTouchMove (e: TouchEvent & Element): void {
    const firstTouch = e.touches[0]
    this.touch.y2 = firstTouch.pageY
    const delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0 // 截断小数后面的数
    const anchorIndex = this.touch.anchorIndex + delta
    this.scrollTo(anchorIndex)
  }

  private scrollTo (index: number): void {
    if (!index && index !== 0) {
      return
    }
    if (index < 0) {
      index = 0
    } else if (index >= this.shortcutList.length - 1) {
      index = this.shortcutList.length - 1
    }
    this.currentIndex = index
    const listViewRef = this.$refs.listView as scroll
    const listGroupRef = this.$refs.listGroup as Array<HTMLElement>
    listViewRef.scrollToElement(listGroupRef[index], 0, false, false)
  }
}
</script>

<style scoped lang="stylus">
.list-view
  position: relative
  width: 100%
  height: 100%
  overflow: hidden
  background: $color-background

  .list-group
    padding-bottom: 30px

    .list-group-title
      height: 30px
      line-height: 30px
      padding-left: 20px
      font-size: $font-size-small
      color: $color-text-l
      background: $color-highlight-background

    .list-group-item
      display: flex
      align-items: center
      padding: 20px 0 0 30px

      .avatar
        width: 50px
        height: 50px
        border-radius: 50%

      .name
        margin-left: 20px
        color: $color-text-l
        font-size: $font-size-medium

  .list-shortcut
    position: absolute
    z-index: 30
    right: 0
    top: 50%
    transform: translateY(-50%)
    width: 20px
    padding: 20px 0
    border-radius: 10px
    text-align: center
    background: $color-background-d

    .item
      padding: 3px
      line-height: 1
      color: $color-text-l
      font-size: $font-size-small

      &.current
        color: $color-theme
</style>
