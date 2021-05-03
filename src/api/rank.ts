import axios from 'axios'

export interface top {
  id?: number,
  name?: string,
  description?: string,
  coverImgUrl?: string
}

export const getTopList = (): Promise<Array<top>> => {
  return axios.get('http://localhost:3000/toplist', {})
    .then((res) => {
      return res.data.list as Array<top>
    })
}
