import Vue from 'vue'
import Vuex from 'vuex'
import { ISong } from '@/common/js/type'
import { playMode } from '@/common/js/config'
import { shuffle } from '@/common/js/util'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

export const SET_PLAYING_STATE = 'SET_PLAYING_STATE'
export const SET_FULL_SCREEN = 'SET_FULL_SCREEN'
export const SET_PLAYLIST = 'SET_PLAYLIST'
export const SET_SEQUENCE_LIST = 'SET_SEQUENCE_LIST'
export const SET_CURRENT_INDEX = 'SET_CURRENT_INDEX'
export const SET_PLAY_MODE = 'SET_PLAY_MODE'

const findIndex = (list: Array<ISong>, song: ISong) => {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export default new Vuex.Store({
  strict: true,
  plugins: [createLogger()],
  state: {
    playing: false, // 是否正在播放
    fullScreen: false, // 播放页面
    playList: [], // 歌曲列表
    sequenceList: [], // 播放列表
    currentIndex: -1, // 当前音乐在列表中的索引
    mode: playMode.sequence // 播放顺序模式
  },
  getters: {
    playing: state => state.playing,
    fullScreen: state => state.fullScreen,
    playList: state => state.playList,
    sequenceList: state => state.sequenceList,
    currentIndex: state => state.currentIndex,
    // 当前歌曲
    currentSong: (state) => {
      return state.sequenceList[state.currentIndex] || {}
    },
    mode: state => state.mode
  },
  mutations: {
    [SET_PLAYING_STATE] (state, flag) {
      state.playing = flag
    },
    [SET_FULL_SCREEN] (state, flag) {
      state.fullScreen = flag
    },
    [SET_PLAYLIST] (state, list) {
      state.playList = list
    },
    [SET_SEQUENCE_LIST] (state, list) {
      state.sequenceList = list
    },
    [SET_CURRENT_INDEX] (state, index) {
      state.currentIndex = index
    },
    [SET_PLAY_MODE] (state, mode) {
      state.mode = mode
    }
  },
  actions: {
    // 选中音乐列表中的一首歌
    selectPlay ({
      commit,
      state
    }, {
      list,
      index
    }) {
      commit(SET_PLAYLIST, list)
      if (state.mode === playMode.random) {
        const randomList: Array<ISong> = shuffle(list)
        commit(SET_SEQUENCE_LIST, randomList)
        index = findIndex(randomList, list[index])
      } else {
        commit(SET_SEQUENCE_LIST, list)
      }
      commit(SET_CURRENT_INDEX, index)
      commit(SET_FULL_SCREEN, true)
      commit(SET_PLAYING_STATE, true)
    },
    // 随机播放列表
    randomPlay ({ commit }, { list }) {
      commit(SET_PLAY_MODE, playMode.random)
      commit(SET_SEQUENCE_LIST, shuffle(list))
      commit(SET_PLAYLIST, list)
      commit(SET_CURRENT_INDEX, 0)
      commit(SET_FULL_SCREEN, true)
      commit(SET_PLAYING_STATE, true)
    },
    // 清空播放列表
    clearSongList ({ commit }) {
      commit(SET_PLAYLIST, [])
      commit(SET_SEQUENCE_LIST, [])
      commit(SET_CURRENT_INDEX, -1)
      commit(SET_PLAYING_STATE, false)
    },
    // 删除列表中的一首歌
    deleteSong ({
      commit,
      state
    }, song) {
      const playList = state.playList.slice()
      const sequenceList = state.sequenceList.slice()
      let currentIndex = state.currentIndex
      const pIndex = findIndex(playList, song)
      playList.splice(pIndex, 1)
      const sIndex = findIndex(sequenceList, song)
      sequenceList.splice(sIndex, 1)
      if (currentIndex > pIndex || currentIndex === playList.length) {
        currentIndex--
      }
      commit(SET_PLAYLIST, playList)
      commit(SET_SEQUENCE_LIST, sequenceList)
      commit(SET_CURRENT_INDEX, currentIndex)
      commit(SET_PLAYING_STATE, !!playList.length)
    }
  },
  modules: {}
})
