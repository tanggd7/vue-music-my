<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend="progressTouchEnd"
           ref="progressBtn">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator'
import { prefixStyle } from '@/common/js/dom'

const progressBtnWidth = 16
const transform = prefixStyle('transform')

interface ITouch {
  initiated: boolean,
  startX: number,
  left: number
}

@Component
export default class ProgressBar extends Vue {
  @Prop({ default: 0 }) private percent!: number

  private touch: ITouch = {
    initiated: false,
    startX: 0,
    left: 0
  }

  $refs!: {
    progressBar: HTMLElement,
    progress: HTMLElement,
    progressBtn: HTMLElement
  }

  private progressClick (e: MouseEvent): void {
    const rect = this.$refs.progressBar.getBoundingClientRect()
    const offsetWidth = e.pageX - rect.left
    this.offset(offsetWidth)
    this.triggerPercent()
  }

  private progressTouchStart (e: TouchEvent): void {
    this.touch.initiated = true
    this.touch.startX = e.touches[0].pageX
    this.touch.left = this.$refs.progress.clientWidth
  }

  private progressTouchMove (e: TouchEvent): void {
    if (!this.touch.initiated) {
      return
    }
    const deltaX = e.touches[0].pageX - this.touch.startX
    const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
    this.offset(offsetWidth)
  }

  private progressTouchEnd (): void {
    this.touch.initiated = false
    this.triggerPercent()
  }

  private triggerPercent (): void {
    const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
    const percent = this.$refs.progress.clientWidth / barWidth
    this.percentChange(percent)
  }

  private offset (offsetWidth: number): void {
    this.$refs.progress.style.width = `${offsetWidth}px`
    this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
  }

  @Emit()
  private percentChange (percent: number): number {
    return percent
  }

  @Watch('percent', { immediate: false })
  private onPercentChange (newPercent: number): void {
    if (newPercent >= 0 && !this.touch.initiated) {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const offsetWidth = newPercent * barWidth
      this.offset(offsetWidth)
    }
  }
}
</script>

<style scoped lang="stylus">
.progress-bar
  height: 30px

  .bar-inner
    position: relative
    top: 13px
    height: 4px
    background: rgba(0, 0, 0, 0.3)

    .progress
      position: absolute
      height: 100%
      background: $color-theme

    .progress-btn-wrapper
      position: absolute
      left: -8px
      top: -13px
      width: 30px
      height: 30px

      .progress-btn
        position: relative
        top: 7px
        left: 7px
        box-sizing: border-box
        width: 16px
        height: 16px
        border: 3px solid $color-text
        border-radius: 50%
        background: $color-theme
</style>
