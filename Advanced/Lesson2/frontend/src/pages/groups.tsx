import React, { useState, useCallback, useEffect, useMemo } from "react"
import useFetch from "@/hooks/useFetch"
import { useCanister, useConnect } from "@connect2ic/react"
import { Modal, Button, Message, toaster, Loader } from 'rsuite'
import { errHandle } from "@/utils"
import UserAvatar from "@/components/UserAvatar"
import LinkBtn from "@/components/LinkBtn"
import HolderBlock from "@/components/HolderBlock"

export default function PageGroups() {
  const [MWCM] = useCanister("MWCM")
  const { isConnected } = useConnect()
  const { res, isFetching, getData } = useFetch(MWCM, ['groups', 'passNum'])

  const [temp, setTemp] = useState<any>(null)
  const [isLoading, setLoad] = useState(false)
  const [open, setOpen] = useState(false)  
  const handleClose = () => {
    setOpen(false)
    setTemp(null)
  }
  const handleOpen = useCallback((item: any) => {
    if(isLoading) return
    setTemp(item)
    setOpen(true)
  },[isLoading])

  const handleKickOff = useCallback(async ()=>{
    if(isLoading)return
    handleClose()    
    try{
      if(!isConnected){
        toaster.push(<Message showIcon type="warning">Please Connect!</Message>)
      }else{
        if(!temp) throw Error("No Member Found")
        setLoad(true)
        const res = await MWCM.checkJoinRejct(temp.principal)
        if(res) {
          toaster.push(<Message showIcon type="info">The application failed, perhaps you have already submitted an application.</Message>)
        }else{
          await MWCM.propose({leave:null}, [temp.principal], [], [])
          toaster.push(<Message showIcon type="info">Application Sent.</Message>)
        }
      }      
    }catch(err: any){
      const msg = errHandle(err)
      toaster.push(<Message showIcon type="error">{msg}</Message>)
    }finally{      
      setLoad(false)   
    }
  },[MWCM,isConnected,isLoading,temp])

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
            : list.map((l:any, i: number)=>(
              <div key={i}>
                <UserAvatar principal={l} />
                <p className="text-gray-400">The Person who works at ... is the master ... balabala ...</p>
                <div className="bg-pink-600 rounded-lg font-blod cursor-pointer my-2 py-2 px-4" onClick={handleOpen}>Kick out</div>
              </div>
            ))
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
      {  isLoading && <Loader style={{zIndex:'10'}} content="loading..." size="md" backdrop center vertical /> }
      {renderList}
      <Modal backdrop="static" role="alertdialog" open={open} onClose={handleClose} size="xs">
        <Modal.Body>
          Once you choose [YES], The system will make an proposal about member-leave.
          Are you sure you want to proceed ?
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleKickOff} appearance="primary">
            [Yes] Plz kick him/her off.
          </Button>
          <Button onClick={handleClose} appearance="subtle">
            [No] Let me reconsider.
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}