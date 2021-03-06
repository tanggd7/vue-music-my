import axios from 'axios'
import { ISong } from '@/common/js/type'
import { API_PREFIX } from './config'

export const getSongUrl = (id: number): Promise<string> => {
  return axios.get(`${API_PREFIX}/song/url`, { params: { id } })
    .then((res) => {
      return res.data.data.length ? res.data.data[0].url : ''
    })
}

export const getSongDetail = (id: number) : Promise<ISong> => {
  return axios.get(`${API_PREFIX}/song/detail`, { params: { ids: id } })
    .then((res) => {
      const songRet = res.data.songs[0]
      const song:ISong = {
        id: songRet.id,
        name: songRet.name,
        author: songRet.ar.map((it: any) => it.name).join(' / '),
        image: songRet.al.picUrl
      }
      return song
    })
}
