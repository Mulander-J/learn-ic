import { useState, useCallback } from "react"
import { wait } from '@/utils'

export default function useFetch(actor: any, cmd: string[]) {
  const [isFetching, setFetch] = useState(false)
  const [res, setRes] = useState<any>([])
  const getData = useCallback(async()=>{
    if(isFetching || !actor) return
    setFetch(true)
    try{
      let _res:any = []
      cmd.forEach(async (c)=>{
        const _l: any = await actor[c]()
        console.log('[_res]',[_l])
        _res.push(_l)
      })
      await wait(1200)
      setRes(_res)
    }catch{
      setRes([])
    }finally{
      setFetch(false)
    }
  },[isFetching, actor])

  return {
    res,
    isFetching,
    getData
  }
}