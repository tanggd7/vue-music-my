import axios, { AxiosResponse } from 'axios'

export interface recommend {
  pic?: string;
  targetId?: number;
}

export interface disc {
  id?: number;
  picUrl?: string;
  name?: string;
  copywriter?: string;
}

export const getRecommendList = (): Promise<Array<recommend>> => {
  return axios.get('http://localhost:3000/banner?type=2', {}).then((res) => {
    return res.data.banners as Array<recommend>
  })
}

export const getDiscList = (): Promise<Array<disc>> => {
  return axios.get('http://localhost:3000/personalized', {}).then((res) => {
    return res.data.result as Array<disc>
  })
}
