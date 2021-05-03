<template>
  <div class="recommend">
    <scroll v-if="loadScroll" ref="scroll" class="recommend-content">
      <div>
        <div v-if="recommendList.length" class="slider-wrapper">
          <slider>
            <div v-for="item in recommendList" :key="item.bannerId">
              <a>
                <img :src="item.pic" alt="">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="item in discList" :key="item.id" class="item">
              <div class="icon">
                <img width="60" height="60" :src="item.picUrl" alt=""/>
              </div>
              <div class="text">
                <h2 class="name" v-html="item.name"></h2>
                <p class="desc" v-html="item.copywriter"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getRecommendList, getDiscList, recommend, disc } from '@/api/recommend'
import Scroll from '@/base/scroll/scroll.vue'
import Slider from '@/base/slider/slider.vue'

@Component({
  components: {
    Slider,
    Scroll
  }
})
export default class Recommend extends Vue {
  private recommendList: Array<recommend> = []
  private discList: Array<disc> = []
  private checkImageLoaded = false

  private get loadScroll (): boolean {
    return !!this.recommendList.length && !!this.discList.length
  }

  private created (): void {
    Promise.all([
      getRecommendList(),
      getDiscList()
    ]).then(([recommendList, discList]): void => {
      this.recommendList = recommendList
      this.discList = discList
    })
  }
}
</script>

<style scoped lang="stylus">
.recommend
  position fixed
  width 100%
  top 88px
  bottom 0

  .recommend-content
    height 100%
    overflow hidden

    .slider-wrapper
      position: relative
      width: 100%
      overflow: hidden

      img
        width 100%
        height 146px

    .recommend-list
      .list-title
        height: 65px
        line-height: 65px
        text-align: center
        font-size: $font-size-medium
        color: $color-theme

      .item
        display: flex
        box-sizing: border-box
        align-items: center
        padding: 0 20px 20px 20px

        .icon
          flex: 0 0 60px
          padding-right: 20px

        .text
          display: flex
          flex-direction: column
          justify-content: center
          flex: 1
          line-height: 20px
          overflow: hidden
          font-size: $font-size-medium

          .name
            margin-bottom: 10px
            color: $color-text

          .desc
            color: $color-text-d
</style>
