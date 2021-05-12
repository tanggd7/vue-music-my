import { Component, Vue, Watch } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { ISong } from '@/common/js/type'

@Component
export class PlayListMixin extends Vue {
  @Getter private playList!: Array<ISong>

  mounted (): void {
    this.handlePlayList(this.playList)
  }

  activated (): void {
    this.handlePlayList(this.playList)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected handlePlayList (list: Array<ISong>): void {
    throw new Error('component must implement handlePlaylist method')
  }

  @Watch('playList', { immediate: false })
  private onPlayListChange (list: Array<ISong>): void {
    this.handlePlayList(list)
  }
}
