import React, { useEffect, useMemo } from "react"
import useFetch from "@/hooks/useFetch"
import { useCanister } from "@connect2ic/react"
import UserAvatar from "@/components/UserAvatar"
import LinkBtn from "@/components/LinkBtn"
import HolderBlock from "@/components/HolderBlock"

export default function PageGroups() {
  const [MWCM] = useCanister("MWCM", { mode: "anonymous" })
  const { res, isFetching, getData } = useFetch(MWCM, ['groups', 'passNum'])
  const renderList = useMemo(() => {
    if( isFetching ) return <HolderBlock/>
    if( res?.length <= 0 ) return 'No Data Yet'    
    const [ list = [], pn = 0 ] = res
    return (
      <div>
        <LinkBtn name="proposal">Goto propose</LinkBtn>
        <p className="my-2">
          <label>PassNum: </label>
          <span className="text-green-400">{pn.toString()}/{list?.length || 0}</span>
        </p>           
        <div className="grid gap-y-4 text-center">
          {
            (list?.length || 0) <= 0 
            ? 'No Data Yet' 
            : list.map((l:any, i: number)=><UserAvatar key={i} principal={l} />)
          }
        </div>
      </div>
    )
  }, [res, isFetching])

  useEffect(() => { MWCM && getData() }, [MWCM])

  return (
    <div className="page-wrapper page-center">
      <h2 className="app-title1">Group</h2>
      <p className="mb-4">Become a uptown member and participate in multi-signature governance</p>    
      {renderList}
    </div>
  )
}