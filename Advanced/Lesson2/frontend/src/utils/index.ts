export const strSlice = (str: string, front = 10, behind = 3): string => {
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

export const errHandle = (err: any) => {
  console.log('[err]', err)
  if(!err?.message) return 'Error'
  if(err.message.includes('Code: 403')) return 'Failed to authenticate request'
  return err.message
}
