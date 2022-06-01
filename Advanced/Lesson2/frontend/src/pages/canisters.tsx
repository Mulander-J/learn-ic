import React, { useEffect, useState, useCallback } from "react"
import { useCanister } from "@connect2ic/react"
import { wait } from '@/utils'
import UserAvatar from "@/components/UserAvatar"
import EmptyBlock from "@/components/EmptyBlock"

export default function PageCanisters() {
  const [isFetching, setFetch] = useState(false)
  const [pn, setPN] = useState(0)
  const [list, setList] = useState<any>([])
  const [MWCM] = useCanister("MWCM", { mode: "anonymous" })
  
  const getData = useCallback(async()=>{
    if(isFetching || !MWCM) return
    setFetch(true)
    try{
      const _l: any = await MWCM.groups()
      const _pn: any = await MWCM.passNum()
      console.log('[group_res]',[ _pn,_l])
      await wait(1200)
      setPN((_pn || 0).toString())
      setList(_l?.length > 0 ? _l : [])
    }catch{
      setList([])
      setPN(0)
    }finally{
      setFetch(false)
    }
  },[isFetching, MWCM])

  useEffect(()=>{
    getData()
  }, [MWCM])

  return (
    <div className="page-wrapper page-center">
      <h2 className="app-title1">Canister</h2>
      <p>Become a uptown member and participate in multi-signature governance</p>
      <p className="my-2">
        <label>PassNum: </label>
        <span className="text-green-400">{pn}/{list.length}</span>
      </p>      
      <div className="grid gap-y-4">
        {
          isFetching
          ? <EmptyBlock/>
          : list.map((l:any, i: number)=><UserAvatar key={i} principal={l} />)
        }
      </div>
    </div>
  )
}