import axios from 'axios'

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
