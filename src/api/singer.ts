import axios from 'axios'

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
