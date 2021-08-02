import axios from 'axios'
import { IListViewGroup, IListViewGroupItem } from '@/base/list-view/list-view'
import { API_PREFIX } from './config'

export const getSearchHotList = (): Promise<Array<string>> => {
  return axios.get(`${API_PREFIX}/search/hot`)
    .then((res) => {
      return res.data.result.hots.map((item: any) => item.first)
    })
}

export const getSearchList = (text: string): Promise<Array<IListViewGroup>> => {
  return axios.get(`${API_PREFIX}/search/suggest`, { params: { keywords: text } })
    .then((res) => {
      const { result } = res.data
      const { artists, songs, playlists } = result
      const array: Array<IListViewGroup> = []
      if (artists) {
        array.push({
          title: '歌手',
          items: artists.map((item: any) => {
            return {
              id: item.id,
              name: item.name,
              group: 'singer'
            } as IListViewGroupItem
          })
        } as IListViewGroup)
      }
      if (songs) {
        array.push({
          title: '歌曲',
          items: songs.map((item: any) => {
            return {
              id: item.id,
              name: item.name,
              group: 'song'
            } as IListViewGroupItem
          })
        } as IListViewGroup)
      }
      if (playlists) {
        array.push({
          title: '歌单',
          items: playlists.map((item: any) => {
            return {
              id: item.id,
              name: item.name,
              group: 'playList'
            } as IListViewGroupItem
          })
        } as IListViewGroup)
      }
      return array
    })
}
