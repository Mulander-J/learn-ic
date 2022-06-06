import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useCanister, useConnect } from "@connect2ic/react"
import { AddSquare, Like1, LikeDislike } from 'iconsax-react'
import { Tag, Progress, Tooltip, Whisper, Divider, Message, Loader, toaster } from 'rsuite'
import useFetch from "@/hooks/useFetch"
import { strSlice, errHandle } from "@/utils"
import { unWrap } from "@/utils/ic4mat"
import LinkBtn from "@/components/LinkBtn"
import HolderBlock from "@/components/HolderBlock"
import UserAvatar from "@/components/UserAvatar"
import { pTypeInfo } from '@/utils/constant'

const PTypes = {
  ...pTypeInfo,
  'join': {
    color: 'blue',
    desc: 'New Member Application'
  },
  'leave':{
    color:'orange',
    desc: 'Please Kick out him/her'
  },
}

export default function PageProposals() {
  const { isConnected } = useConnect()
  const [MWCM] = useCanister("MWCM")
  const { res, isFetching, getData } = useFetch(MWCM,  ['proposes'])
  const [ isVoting, setVoting ] = useState(false)

  const handleVote = useCallback(async (id:string, vote:boolean) => {
    try{
      if(!isConnected){
        toaster.push(<Message showIcon type="warning">Please Connect!</Message>)
        return null
      }
      setVoting(true)
      const _res :any = await MWCM.vote(id, vote)
      if(_res?.ok){
        toaster.push(<Message showIcon type="success">{_res?.ok}</Message>)
        const _new: any = await MWCM.getProposes(id)
        return _new?.[0]
      }else{
        toaster.push(<Message showIcon type="error">{_res?.err}</Message>)
        return null
      }
    }catch(err: any){
      const msg = errHandle(err)
      toaster.push(<Message showIcon type="error">{msg}</Message>)
      return null
    }finally{
      setVoting(false)
    }
  }, [isConnected, MWCM, isVoting])

  const renderList = useMemo(()=>{
    if(isFetching) return <HolderBlock/>
    if(res?.length<=0) return 'No Data Yet' 

    const [list = [], _m = 0] = res[0]

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
            : list.map((l:any, i: number)=><ItemCard key={i} item={l} m={Number(_m)} onVote={handleVote} />)
          }
        </div>
      </div>
    )
  }, [res, isFetching])

  useEffect(()=>{ MWCM && getData() }, [MWCM])

  return (
    <div className="page-wrapper page-center">
      <h2 className="app-title1 flex">
        <span>Proposal</span>
        <LinkBtn isIcon name="propose">
          <AddSquare size="32" color="#37d67a" variant="TwoTone"/>   
        </LinkBtn>           
      </h2>      
      <p className="mb-4">Vote to decide if the proposal is implemented</p>
      {isVoting && <Loader style={{zIndex:'10'}} content="loading..." size="md" backdrop center vertical />}      
      {renderList}
    </div>
  )
}

const ItemCard = (props: any)=>{
  const { item, m, onVote } = props  
  const pType = Object.keys(item?.pType)[0]
  const _info = PTypes?.[pType] || {
    color:'violet',
    desc: 'Proposal'
  }
  const [_d, setD] = useState<any>(null)

  const initData = (item ?:any) => {
    const approved = (item?.approvers?.length || 0)
    const percent = Math.round(100 * approved / (m||1))
    const wasmSha256 = unWrap(item?.wasm_sha256)
    const canister_id = unWrap(item?.canister_id)

    setD({
      ...item,
      _info,
      percent,
      approved,
      wasmSha256,
      canister_id
    })
  }

  useEffect(() => { initData(item) }, [pType])

  const handleVote = async (vote: boolean) => {
    const res = await onVote(_d.id, vote)
    res && initData(res)
  }

  return (
    <div className={_d?.settled ? 'p-settled' : 'p-item'}>
      <div className="flex justify-between items-start">        
        <UserAvatar principal={_d?.proposer} />
        <div>
          <p className="text-md font-semibold text-right">Id#{_d?.id}</p> 
          <Tag color={_info.color} className="text-black font-semibold">{pType}</Tag>
        </div>
      </div>
      <p className="my-2 text-left">{_info.desc}</p>
      <Divider />
      {_d?.canister_id && (
        <p className="my-4 text-red-400">
          <label>{(pType === 'join' || pType === 'leave') ? 'Principal':'CanisterId'}: </label>
          <span>{strSlice(_d.canister_id.toString())}</span>
        </p>
      )}
      {_d?.wasmSha256 && (
        <p className="my-4 text-red-400">
          <label>WASM SHA256: </label>
          <span>{_d.wasmSha256}</span>
        </p>
      )}
      <h4 className="text-left">Votes Stats :  {_d?.approved} / {m}</h4>
      <Progress.Line percent={_d?.percent} status="active" />
      {
        !_d?.settled && (
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