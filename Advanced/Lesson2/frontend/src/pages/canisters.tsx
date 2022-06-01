import React, { useEffect, useMemo } from "react"
import useFetch from "@/hooks/useFetch"
import { useCanister } from "@connect2ic/react"
import { Lock1 } from 'iconsax-react'
import { FlexboxGrid } from 'rsuite'
import UserAvatar from "@/components/UserAvatar"
import LinkBtn from "@/components/LinkBtn"
import HolderBlock from "@/components/HolderBlock"

export default function PageCanisters() {
  const [MWCM] = useCanister("MWCM", { mode: "anonymous" })
  const { res, isFetching, getData } = useFetch(MWCM, ['canisters'])

  const renderList = useMemo(()=>{
    if(isFetching) return <HolderBlock/>
    if(res?.length<=0) return 'No Data Yet'
    const [ list=[] ] = res
    return (
      <div>
        <LinkBtn name="proposal">Goto propose</LinkBtn>
        <div className="grid gap-y-4 text-center mt-8">
          {
            (list?.length||0)<=0 
            ? 'No Data Yet' 
            : list.map((l:any, i: number)=><CanisterCard key={i} item={l}/>)
          }
        </div>
      </div>
    )
  },[res,isFetching])

  useEffect(()=>{
    getData()
  }, [MWCM])

  return (
    <div className="page-wrapper page-center">
      <h2 className="app-title1">Canister</h2>
      <p className="mb-4">Canister maintained by members</p>    
      {renderList}
    </div>
  )
}

const CanisterCard = (props:any)=>{
  const { item } = props
  return (
    <FlexboxGrid align="top" justify="center">
      <FlexboxGrid.Item>
        <label>Canister</label>
        <UserAvatar principal={item?.cid} hideAvatar />
      </FlexboxGrid.Item>
      <FlexboxGrid.Item className="mx-4">
        <label>SHA256</label>
        <p>{item?.codeSHA || '--'}</p>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item>
        <label>Require Multi-Sign</label>
        {item?.auth ? <Lock1 className="my-2 mx-auto" size="20" color="#f47373" variant="TwoTone"/> : 'Open'}
      </FlexboxGrid.Item>
    </FlexboxGrid>
  )
}