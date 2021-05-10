import axios from 'axios'

export const getSongUrl = (id: number): Promise<string> => {
  return axios.get('http://localhost:3000/song/url', { params: { id } })
    .then((res) => {
      return res.data.data.length ? res.data.data[0].url : ''
    })
}
