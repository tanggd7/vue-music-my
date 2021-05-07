import axios from 'axios'

export interface IRecommend {
  pic?: string;
  targetId?: number;
}

export const getRecommendList = (): Promise<Array<IRecommend>> => {
  return axios.get('http://localhost:3000/banner?type=2', {})
    .then((res) => {
      return res.data.banners as Array<IRecommend>
    })
}

export interface IDisc {
  id?: number;
  picUrl?: string;
  name?: string;
  copywriter?: string;
}

export const getDiscList = (): Promise<Array<IDisc>> => {
  return axios.get('http://localhost:3000/personalized', {})
    .then((res) => {
      return res.data.result as Array<IDisc>
    })
}

export interface IDiscDetailSong {
  id?: number,
  name?: string,
  author?: string,
}

export interface IDiscDetail {
  id?: number,
  name?: string,
  bgImage?: string,
  songList?: Array<IDiscDetailSong>
}

export const getDiscDetail = (id: string | number): Promise<any> => {
  return axios.get('http://localhost:3000/playlist/detail?id=' + id, {})
    .then((res) => {
      const { playlist } = res.data
      const {
        id,
        name,
        coverImgUrl,
        tracks = []
      } = playlist
      const ret: IDiscDetail = {
        id,
        name,
        bgImage: coverImgUrl,
        songList: tracks.map((item: any): IDiscDetailSong => {
          return {
            id: item.id,
            name: item.name,
            author: item.ar.map((it: any) => it.name).join(' / ')
          }
        })
      }
      return ret
    })
}
