import axios from 'axios'
import { ISong } from '@/common/js/type'

export interface ITop {
  id?: number,
  name?: string,
  description?: string,
  coverImgUrl?: string
}

export const getTopList = (): Promise<Array<ITop>> => {
  return axios.get('http://localhost:3000/toplist', {})
    .then((res) => {
      return res.data.list as Array<ITop>
    })
}

export interface ITopListDetail {
  id?: number,
  name?: string,
  bgImage?: string,
  songList?: Array<ISong>
}

export const getTopListDetail = (id: string | number): Promise<ITopListDetail> => {
  return axios.get('http://localhost:3000/playlist/detail', { params: { id } })
    .then((res) => {
      const { playlist } = res.data
      const {
        id,
        name,
        coverImgUrl,
        tracks = []
      } = playlist
      const ret: ITopListDetail = {
        id,
        name,
        bgImage: coverImgUrl,
        songList: tracks.map((item: any): ISong => {
          const song: ISong = {
            id: item.id,
            name: item.name
          }
          song.author = item.ar.map((it: any) => it.name).join(' / ')
          song.image = item.al.picUrl
          return song
        })
      }
      return ret
    })
}
