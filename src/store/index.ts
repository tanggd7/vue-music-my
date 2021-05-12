import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const SET_PLAYING_STATE = 'SET_PLAYING_STATE'
export const SET_PLAYLIST = 'SET_PLAYLIST'
export const SET_CURRENT_INDEX = 'SET_CURRENT_INDEX'

export default new Vuex.Store({
  state: {
    playing: false, // 是否正在播放
    playList: [], // 播放列表
    currentIndex: -1 // 当前音乐在列表中的索引
  },
  getters: {
    playing: state => state.playing,
    playList: state => state.playList,
    currentIndex: state => state.currentIndex,
    // 当前歌曲
    currentSong: (state) => {
      return state.playList[state.currentIndex] || {}
    }
  },
  mutations: {
    [SET_PLAYING_STATE] (state, flag) {
      state.playing = flag
    },
    [SET_PLAYLIST] (state, list) {
      state.playList = list
    },
    [SET_CURRENT_INDEX] (state, index) {
      state.currentIndex = index
    }
  },
  actions: {
    // 选中音乐列表中的一首歌
    selectPlay ({ commit }, { list, index }) {
      commit(SET_PLAYLIST, list)
      commit(SET_CURRENT_INDEX, index)
      commit(SET_PLAYING_STATE, true)
    }
  },
  modules: {}
})
