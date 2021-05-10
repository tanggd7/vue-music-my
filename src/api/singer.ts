import axios from 'axios'
import { ISong } from '@/common/js/type'

const pinyin = require('js-pinyin')

const OTHER_INDEX = '其他'

export interface ISinger {
  id: number,
  name: string,
  picUrl: string,
  sIndex: string
}

export const getSingerList = (): Promise<Array<ISinger>> => {
  return axios.get('http://localhost:3000/top/artists?offset=0&limit=30', {})
    .then((res) => {
      name2PinYing(res.data.artists)
      return res.data.artists as Array<ISinger>
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
  return axios.get('http://localhost:3000/artist/detail?id=' + id)
    .then((res) => {
      const { artist } = res.data.data
      const {
        cover,
        name
      } = artist
      const detail: ISingerDetail = {
        name,
        bgImage: cover
      }
      return detail
    })
}

export const getSingerDetailSong = (id: string | number): Promise<Array<ISong>> => {
  return axios.get('http://localhost:3000/artist/top/song?id=' + id)
    .then((res) => {
      const songs = res.data.songs
      const array: Array<ISong> = songs.map((item: any) => {
        const song: ISong = { id: item.id, name: item.name }
        song.author = item.ar.map((it: any) => it.name).join(' / ')
        song.image = item.al.picUrl
        return song
      })
      return array
    })
}
