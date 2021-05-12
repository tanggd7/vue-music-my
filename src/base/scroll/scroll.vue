<template>
  <div ref="wrapper">
    <slot/>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator'
import BScroll from 'better-scroll'
import { IPosition } from '@/base/scroll/scroll'

@Component({})
export default class Scroll extends Vue {
  @Prop({ default: true }) private click!: boolean
  @Prop({ default: false }) private listenScroll!: boolean
  @Prop({ default: null }) private data!: Array<any>
  @Prop({ default: 2 }) private probeType!: number

  private bs?: BScroll

  mounted (): void {
    this.initScroll()
  }

  public refresh (): void {
    this.bs && this.bs.refresh()
  }

  public scrollToElement (el: HTMLElement): void {
    this.bs && this.bs.scrollToElement(el, 0, false, false)
  }

  private initScroll (): void {
    if (!this.$refs.wrapper) {
      return
    }

    this.bs = new BScroll(this.$refs.wrapper as HTMLElement, {
      scrollY: true,
      click: this.click,
      probeType: this.probeType
    })

    if (this.listenScroll) {
      this.bs.on('scroll', (position: IPosition) => {
        this.scroll && this.scroll(position)
      })
    }
  }

  @Emit()
  private scroll (position: IPosition): IPosition {
    return position
  }

  @Watch('data', { immediate: false })
  private onDataChange (): void {
    this.$nextTick(() => {
      this.refresh()
    })
  }
}
</script>

<style scoped>

</style>
