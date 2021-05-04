<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot/>
    </div>
    <div class="dots">
      <span class="dot" :class="{active: currentPageIndex === index }" v-for="(item, index) in dots" :key="item"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import BScroll from 'better-scroll'
import { addClass } from '@/common/js/dom'
import { ISlidePage } from '@/base/slider/slider'

@Component({})
export default class Slider extends Vue {
  private dots: Array<number> = []
  private currentPageIndex = 0
  private slider!: BScroll
  private sliderRef!: HTMLElement
  private sliderGroupRef!: HTMLElement

  public mounted (): void {
    this.sliderGroupRef = this.$refs.sliderGroup as HTMLElement
    this.sliderRef = this.$refs.slider as HTMLElement
    const children = this.sliderGroupRef.children
    if (children.length) {
      this.setSliderWidth()
      this.initDots()
      this.initSlider()
    }
  }

  private setSliderWidth (): void {
    const children = this.sliderGroupRef.children
    let width = 0
    const sliderWidth = this.sliderRef.clientWidth
    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement
      addClass(child, 'slider-item')
      child.style.width = `${sliderWidth}px`
      width += sliderWidth
    }
    this.sliderGroupRef.style.width = `${width}px`
  }

  private initDots (): void {
    this.dots = new Array<number>(this.sliderGroupRef.children.length)
  }

  private initSlider (): void {
    const slider = this.slider = new BScroll(this.sliderRef, {
      scrollX: true,
      scrollY: false,
      momentum: false, // 当快速在屏幕上滑动一段距离的时候，会根据滑动的距离和时间计算出动量，并生成滚动动画
      bounce: false, // 当滚动超过边缘的时候会有一小段回弹动画
      stopPropagation: true, // 是否阻止事件冒泡。多用在嵌套 scroll 的场景
      probeType: 3,
      slide: {
        loop: true,
        autoplay: true
      }
    })

    slider.on('slideWillChange', (page: ISlidePage) => {
      this.currentPageIndex = page.pageX
    })
  }
}
</script>

<style scoped lang="stylus">
.slider
  min-height: 1px

  .slider-group
    position: relative
    overflow: hidden
    white-space: nowrap

    .slider-item
      float: left
      box-sizing: border-box
      overflow: hidden
      text-align: center

      a
        display: block
        width: 100%
        overflow: hidden
        text-decoration: none

      img
        display: block
        width: 100%

  .dots
    position: absolute
    right: 0
    left: 0
    bottom: 12px
    text-align: center
    font-size: 0

    .dot
      display: inline-block
      margin: 0 4px
      width: 8px
      height: 8px
      border-radius: 50%
      background: $color-text-l

      &.active
        width: 20px
        border-radius: 5px
        background: $color-text-ll
</style>
