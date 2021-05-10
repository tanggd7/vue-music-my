<template>
  <div class="progress-circle">
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent"/>
      <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" :stroke-dasharray="dashArray"
              :stroke-dashoffset="dashOffset"/>
    </svg>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class ProgressCircle extends Vue {
  @Prop({ default: 100 }) private radius!: number
  @Prop({ default: 0 }) private percent!: number

  private dashArray = Math.PI * 100 // circle 的 r 半径为 50

  private get dashOffset (): number {
    return (1 - this.percent) * this.dashArray
  }
}
</script>

<style scoped lang="stylus">
.progress-circle
  position: relative

  circle
    stroke-width: 8px
    transform-origin: center

    &.progress-background
      transform: scale(0.9)
      stroke: $color-theme-d

    &.progress-bar
      transform: scale(0.9) rotate(-90deg)
      stroke: $color-theme
</style>
