const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const shuffle = <T> (arr: Array<T>): Array<T> => {
  const _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    const j = getRandomInt(0, i)
    const t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

export const handleWangYiImage2Small = (url?: string, size = '130y130'): string => {
  if (!url) {
    return ''
  }
  let urlStr = url + (url.includes('?') ? '&' : '?')
  urlStr += `&param=${size}`
  return urlStr
}
