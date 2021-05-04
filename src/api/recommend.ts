import axios from 'axios'

export interface IRecommend {
  pic?: string;
  targetId?: number;
}

export interface IDisc {
  id?: number;
  picUrl?: string;
  name?: string;
  copywriter?: string;
}

export const getRecommendList = (): Promise<Array<IRecommend>> => {
  return axios.get('http://localhost:3000/banner?type=2', {})
    .then((res) => {
      return res.data.banners as Array<IRecommend>
    })
}

export const getDiscList = (): Promise<Array<IDisc>> => {
  return axios.get('http://localhost:3000/personalized', {})
    .then((res) => {
      return res.data.result as Array<IDisc>
    })
}
