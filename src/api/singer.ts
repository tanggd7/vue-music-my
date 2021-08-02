import axios from 'axios'
import { ISong } from '@/common/js/type'
import { handleWangYiImage2Small } from '@/common/js/util'
import { API_PREFIX } from './config'

const pinyin = require('js-pinyin')

const OTHER_INDEX = '其他'

export interface ISinger {
  id: number,
  name: string,
  picUrl: string,
  sIndex: string
}

export const getSingerList = (): Promise<Array<ISinger>> => {
  return axios.get(`${API_PREFIX}/top/artists?offset=0&limit=100`, {})
    .then((res) => {
      name2PinYing(res.data.artists)
      return res.data.artists.map((item: ISinger) => ({ ...item, picUrl: handleWangYiImage2Small(item.picUrl, '100y100') }))
    })
}

const name2PinYing = (array: Array<ISinger>) => {
  array.forEach((item) => {
    const sIndex = pinyin.getCamelChars(item.name).substr(0, 1)
    if (sIndex.match(/[a-zA-Z]/)) {
      item.sIndex = sIndex.toUpperCase()
    } else {
      item.sIndex = OTHER_INDEX
    }
  })
}

export interface ISingerDetail {
  name?: string,
  bgImage?: string
}

export const getSingerDetail = (id: string | number): Promise<ISingerDetail> => {
  return axios.get(`${API_PREFIX}/artist/detail?id=` + id)
    .then((res) => {
      const { artist } = res.data.data
      const {
        cover,
        name
      } = artist
      const detail: ISingerDetail = {
        name,
        bgImage: handleWangYiImage2Small(cover, '400y400')
      }
      return detail
    })
}

export const getSingerDetailSong = (id: string | number): Promise<Array<ISong>> => {
  return axios.get(`${API_PREFIX}/artist/top/song?id=` + id)
    .then((res) => {
      const songs = res.data.songs
      const array: Array<ISong> = songs.map((item: any) => {
        const song: ISong = { id: item.id, name: item.name }
        song.author = item.ar.map((it: any) => it.name).join(' / ')
        song.image = handleWangYiImage2Small(item.al.picUrl, '300y300')
        return song
      })
      return array
    })
}
