import { Component, Vue, Watch } from 'vue-property-decorator'
import { Getter, Mutation } from 'vuex-class'
import { ISong } from '@/common/js/type'
import { playMode } from '@/common/js/config'
import { SET_CURRENT_INDEX, SET_PLAY_MODE, SET_PLAYING_STATE, SET_SEQUENCE_LIST } from '@/store'
import { shuffle } from '@/common/js/util'

@Component
export class PlayListMixin extends Vue {
  @Getter protected playList!: Array<ISong>

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

@Component
export class PlayerMixin extends Vue {
  @Getter protected playList!: Array<ISong>
  @Getter protected sequenceList!: Array<ISong>
  @Getter protected currentSong!: ISong
  @Getter protected mode!: number

  @Mutation(SET_SEQUENCE_LIST) protected setSequenceList!: (list: Array<ISong>) => void
  @Mutation(SET_PLAYING_STATE) protected setPlayingState!: (flag: boolean) => void
  @Mutation(SET_CURRENT_INDEX) protected setCurrentIndex!: (index: number) => void
  @Mutation(SET_PLAY_MODE) protected setPlayMode!: (num: number) => void

  protected get iconMode (): string {
    return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
  }

  protected changeMode (): void {
    const mode = (this.mode + 1) % 3
    this.setPlayMode(mode)
    let list
    if (mode === playMode.random) {
      list = shuffle(this.playList)
    } else {
      list = this.playList
    }
    const index = list.findIndex((item) => item.id === this.currentSong.id)
    this.setCurrentIndex(index)
    this.setSequenceList(list)
  }
}
