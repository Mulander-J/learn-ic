export const strSlice = (str: string, front = 6, behind = 3): string => {
  if (typeof str !== 'string' || str.length === 0) return ''
  if (front + behind >= str.length) return str
  return `${str.slice(0, front)}${front < str.length ? '...' : ''}${
    behind === 0 ? '' : str.slice(-behind)
  }`
}

export const wait = (ms:number) => {
  return new Promise((resolve) => {
    setTimeout(() => {resolve(ms)}, ms)
  })
}
