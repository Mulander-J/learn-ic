import React, { useEffect, useMemo, useState, useCallback } from "react"
import { useCanister } from "@connect2ic/react"
import { CSSTransition } from 'react-transition-group'
import { Lock1, MoreSquare } from 'iconsax-react'
import { FlexboxGrid, Loader, Divider, Whisper, Tooltip, Message, toaster } from 'rsuite'
import useFetch from "@/hooks/useFetch"
import { errHandle } from "@/utils"
import { onlyVec } from "@/utils/ic4mat"
import UserAvatar from "@/components/UserAvatar"
import LinkBtn from "@/components/LinkBtn"
import HolderBlock from "@/components/HolderBlock"

export default function PageCanisters() {
  const [MWCM] = useCanister("MWCM")
  const { res, isFetching, getData } = useFetch(MWCM, ['canisters'])

  const handleStats = useCallback(async (cid: any) => {
    try{
      const _stats = await MWCM.checkCanisters(cid)
      return _stats
    }catch(err:any){
      const msg = errHandle(err)
      toaster.push(<Message showIcon type="error">{msg}</Message>)
      return null
    }
  }, [ MWCM ])

  const renderList = useMemo(() => {
    if( isFetching ) return <HolderBlock/>
    if( res?.length <= 0 ) return 'No Data Yet'
    const [ list = [] ] = res
    return (
      <div>
        <LinkBtn name="proposal">Goto propose</LinkBtn>
        <div className="grid gap-y-4 text-center mt-8">
          {
            (list?.length||0)<=0 
            ? 'No Data Yet' 
            : list.map((l:any, i: number) => <CanisterCard key={i} item={l} onStats={handleStats} />)
          }
        </div>
      </div>
    )
  }, [res, isFetching])

  useEffect(() => { MWCM && getData() }, [MWCM])

  return (
    <div className="page-wrapper page-center">
      <h2 className="app-title1">Canister</h2>
      <p className="mb-4">Canister maintained by members</p>    
      {renderList}
    </div>
  )
}

function CanisterCard (props:any) {
  const { item, onStats } = props
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setLoad] = useState(false)
  const getMore = async ()=>{
    setLoad(true)
    const res = await onStats(item.cid)
    // console.log('getMore', res)
    setStats(res || null)
    setLoad(false)
  } 
  return (
    <div className="w-full">
      <FlexboxGrid align="top" justify="center">
        <FlexboxGrid.Item>
          <label>Canister</label>
          <UserAvatar principal={item?.cid} hideAvatar />
        </FlexboxGrid.Item>
        <FlexboxGrid.Item className="mx-4">
          <label>Require Multi-Sign</label>
          {item?.auth ? <Lock1 className="my-2 mx-auto" size="20" color="#f47373" variant="TwoTone"/> : 'Open'}
        </FlexboxGrid.Item>
        <FlexboxGrid.Item>
          <label>More Info</label>
          {
            isLoading 
            ? <Loader  className="block my-2"/> 
            : (
              <Whisper speaker={<Tooltip>Check More Detail</Tooltip>}>            
                <MoreSquare onClick={getMore} className="app-IconBtn my-2" size="20" color="#FF8A65"/>
              </Whisper>     
            )
          }                     
        </FlexboxGrid.Item>      
      </FlexboxGrid>
      <CSSTransition in={!!stats} classNames="fade" timeout={300} unmountOnExit>
        <>
          <Divider/>
          {
            stats && (
              <FlexboxGrid align="top" justify="space-between">
                <FlexboxGrid.Item>
                  <label>status</label>
                  <p>{onlyVec(stats?.status)}</p>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item>
                  <label>cycles</label>
                  <p>{Number(stats?.cycles)}</p>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item>
                  <label>module_hash</label>
                  <p>{stats?.module_hash}</p>
                </FlexboxGrid.Item>
              </FlexboxGrid>
            )
          }
        </>
      </CSSTransition>
    </div>
  )
}