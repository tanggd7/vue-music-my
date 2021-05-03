<template>
  <div ref="wrapper">
    <slot/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import BScroll from 'better-scroll'

@Component({})
export default class Scroll extends Vue {
  @Prop({ default: true }) private click!: boolean

  private scroll?: BScroll

  public mounted (): void {
    this.initScroll()
  }

  public refresh (): void {
    this.scroll && this.scroll.refresh()
  }

  public scrollToElement (): void {
    this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
  }

  private initScroll (): void {
    if (!this.$refs.wrapper) {
      return
    }

    this.scroll = new BScroll(this.$refs.wrapper as HTMLElement, {
      scrollY: true,
      click: this.click
    })
  }
}
</script>

<style scoped>

</style>
