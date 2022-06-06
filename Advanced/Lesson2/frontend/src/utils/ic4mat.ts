import { Principal } from '@dfinity/principal'

export const PrincipalFrTxt = async (txt:string) => {
  try{
    let _p = Principal.fromText(txt)
    if( _p._isPrincipal) return _p
    else return false
  }catch(e){
    return false
  }
}

export const unWrap = (opt: any) => {
  if(!opt) return null
  if(Array.isArray(opt)) return opt?.[0] || null
  return opt
}

export const onlyVec = (vec: any) => {
  if(!vec) return ''
  return Object.keys(vec)?.[0] || ''
}