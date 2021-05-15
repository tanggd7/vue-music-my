import axios from 'axios'
import { ISong } from '@/common/js/type'
import { handleWangYiImage2Small } from '@/common/js/util'

export interface ITop {
  id?: number,
  name?: string,
  description?: string,
  coverImgUrl?: string
}

export const getTopList = (): Promise<Array<ITop>> => {
  return axios.get('http://localhost:3000/toplist', {})
    .then((res) => {
      return res.data.list.map((item: ITop) => ({ ...item, coverImgUrl: handleWangYiImage2Small(item.coverImgUrl) }))
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
        bgImage: handleWangYiImage2Small(coverImgUrl, '400y400'),
        songList: tracks.map((item: any): ISong => {
          const song: ISong = {
            id: item.id,
            name: item.name
          }
          song.author = item.ar.map((it: any) => it.name).join(' / ')
          song.image = handleWangYiImage2Small(item.al.picUrl, '300y300')
          return song
        })
      }
      return ret
    })
}
