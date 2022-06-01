import React, { useEffect, useMemo } from "react"
import { useCanister } from "@connect2ic/react"
import { AddSquare, Like1, LikeDislike } from 'iconsax-react'
import { Tag, Progress, Tooltip, Whisper } from 'rsuite'
import useFetch from "@/hooks/useFetch"
import LinkBtn from "@/components/LinkBtn"
import HolderBlock from "@/components/HolderBlock"
import UserAvatar from "@/components/UserAvatar"
import { pTypeInfo } from '@/utils/constant'

export default function PageProposals() {
  const [MWCM] = useCanister("MWCM", { mode: "anonymous" })
  const { res, isFetching, getData } = useFetch(MWCM,  ['proposes'])

  const renderList = useMemo(()=>{
    if(isFetching) return <HolderBlock/>
    if(res?.length<=0) return 'No Data Yet' 

    const [list=[], _m=0] = res[0]

    return (
      <div>
        <div className="grid gap-x-4 grid-cols-2">
          <LinkBtn name="group">Who we are</LinkBtn>
          <LinkBtn name="canister">What we have</LinkBtn>
        </div>
        <div className="grid gap-y-4 text-center mt-8">
          {
            list.length<=0 
            ? 'No Data Yet' 
            : list.map((l:any, i: number)=><ItemCard item={l} m={Number(_m)} key={i} />)
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
      <h2 className="app-title1 flex">
        <span>Proposal</span>
        <LinkBtn isIcon name="propose">
          <AddSquare size="32" color="#37d67a" variant="TwoTone"/>   
        </LinkBtn>           
      </h2>      
      <p className="mb-4">Vote to decide if the proposal is implemented</p>    
      {renderList}
    </div>
  )
}

const ItemCard = (props: any)=>{
  const { item, m } = props
  const pType = Object.keys(item?.pType)[0]
  const _info = pTypeInfo?.[pType] || {
    color:'violet',
    desc: 'Proposal'
  }
  const approved = (item?.approvers?.length || 0)
  const percent = Math.round(100 * approved / (m||1))

  const handleVote = (vote: boolean)=>{
    console.log('vote', [item, vote])
    alert(`You clikc vote ${vote}`)
  }

  return (
    <div className={item?.settled ? 'p-settled' : 'p-item'}>
      <div className="flex justify-between items-start">        
        <UserAvatar principal={item?.proposer}/>
        <div>
          <p className="text-md font-semibold text-right">Id#{item?.id}</p> 
          <Tag color={_info.color}>{pType}</Tag>
        </div>
      </div>
      <p className="my-2 text-left">{_info.desc}</p>
      {item.codeSHA && <p className="my-4 text-red-400">{item.codeSHA}</p>}
      <h4 className="text-left">Votes Stats :  {approved} / {m}</h4>
      <Progress.Line percent={percent} status="active" />
      {
        !item?.settled && (
          <div className="grid grid-cols-2 gap-x-2 mt-2">
            <Whisper speaker={<Tooltip>Vote Yes</Tooltip>}>
              <Like1 onClick={()=>{handleVote(true)}} className="app-IconBtn" size="32" color="#37d67a" variant="TwoTone"/>
            </Whisper>
            <Whisper speaker={<Tooltip>Revoke Vote</Tooltip>}>
              <LikeDislike onClick={()=>{handleVote(false)}} className="app-IconBtn" size="32" color="#f47373" variant="TwoTone"/>
            </Whisper>                   
          </div>
        )
      }
    </div>
  )
}