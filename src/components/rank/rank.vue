<template>
  <div class="rank">
    <scroll v-if="topList.length" class="rank-content" ref="scroll">
      <ul>
        <li class="item" v-for="item in topList" :key="item.id">
          <div>
            <img width="100" height="100" v-lazy="item.coverImgUrl" alt=""/>
          </div>
          <div class="text">
            <p class="desc">{{ breakText(item.description) }}</p>
          </div>
        </li>
      </ul>
    </scroll>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Scroll from '@/base/scroll/scroll.vue'
import { getTopList, ITop } from '@/api/rank'

@Component({
  components: { Scroll }
})
export default class Rank extends Vue {
  private topList: Array<ITop> = []

  private created (): void {
    getTopList().then((data) => {
      this.topList = data
    })
  }

  private breakText (str: string): string {
    if (!str) return '暂无介绍'
    return str.length > 60
      ? str.substr(0, 60) + '...'
      : str
  }
}
</script>

<style scoped lang="stylus">
.rank
  position fixed
  width 100%
  top 88px
  bottom 0

  .rank-content
    height: 100%
    overflow: hidden

    .item
      display: flex
      margin: 0 20px
      padding-top: 20px
      height: 100px

      &:last-child
        padding-bottom: 20px

      .text
        flex: 1
        display: flex
        flex-direction: column
        justify-content: center
        padding: 0 20px
        height: 100px
        overflow: hidden
        background: $color-highlight-background
        color: $color-text-d
        font-size: $font-size-small

        .desc
          line-height: 16px
</style>
