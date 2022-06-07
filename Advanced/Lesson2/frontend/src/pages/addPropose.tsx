import React, { useCallback, useState, useRef } from 'react'
import { useNavigate } from "react-router-dom"
import { CSSTransition } from 'react-transition-group'
import { errHandle } from "@/utils"
import { PrincipalFrTxt } from "@/utils/ic4mat"
import { useCanister, useConnect } from "@connect2ic/react"
import { 
  Modal, ButtonToolbar, Button, 
  Schema, Form, SelectPicker, Uploader,
  Loader, Message, toaster
} from 'rsuite'
import { pTypeInfo } from "@/utils/constant"
import ImgBarrel4 from "@img/barrel-004.jpg"

const pTypeData = Object
  .keys(pTypeInfo)
  .map((p: string) => ({
    label: p.toUpperCase(),
    value: p
  })
)

const initFormValue = {
  pType: '',
  canisterId: '',
  wasm_code: null
}

const ruleRequire = Schema.Types.StringType().isRequired('This field is required.')

export default function AddPropose() {
  const navigate = useNavigate()
  const { isConnected } = useConnect()
  const [MWCM] = useCanister("MWCM")

  const formRef:any = useRef()

  const [open, setOpen] = useState(false)
  const [isLoading, setLoad] = useState(false)
  const [formValue, setFormValue] = useState<any>(initFormValue)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const onCancel = () => { 
    handleClose()
    navigate('/') 
  }

  const onSubmit = useCallback(async ()=>{
    if(isLoading) return
    try{
      if(!isConnected){  throw Error('Please Connect!') }

      if (!formRef?.current.check()) { throw Error('Form Error') }

      const { pType, canisterId, wasm_code } = formValue

      const _canisterId = await PrincipalFrTxt(canisterId)      
      if(!_canisterId && pType !== 'create'){ throw Error('Please input correct canisterId!') }

      let wasm_blob: any | [number] = null
      if(pType == 'install'){
        if(!wasm_code){
          throw Error('Please upload WASM Code!') 
        }else{
          const arrBuffer  = await wasm_code.arrayBuffer()
          wasm_blob = Array.from(new Uint8Array(arrBuffer))
          // wasm_blob = new Uint8Array(arrBuffer)
          if(!wasm_blob){ throw Error('File Convert Failed!') }
        }
      }
      // const res: any = await MWCM.test(wasm_blob)
      // console.log("res", res)

      const payloads = [
        {[pType]:null},
        _canisterId ? [_canisterId] : [],
        wasm_blob ? [wasm_blob] : []
      ]
      console.log('[payloads]', payloads)

      setLoad(true)
      const res: any = await MWCM.propose(...payloads)
      if(res?.err){
        toaster.push(<Message showIcon type="error">{res?.err}</Message>)
      } else if(res?.ok){
        toaster.push(<Message showIcon type="success">Propose Success! ID: {res?.ok}</Message>)
      }
    }catch(err: any){
      const msg = errHandle(err)
      toaster.push(<Message showIcon type="error">{msg}</Message>)
    }finally{
      setLoad(false)
    }
  },[MWCM,isConnected,isLoading,formRef,formValue])


  return (
    <div className="page-wrapper page-center page-propose">
      <h2 className="app-title1">Propose</h2>
      <section className="propose-cover"></section>
      {  isLoading && <Loader style={{zIndex:'10'}} content="loading..." size="md" backdrop center vertical /> }
      <Form 
        className='bg-black bg-opacity-40 py-4 px-8 rounded-lg' 
        fluid ref={formRef} model={formValue} 
        onChange={formValue => setFormValue(formValue)}
      >
        <Form.Group controlId="pType">
          <Form.ControlLabel>Propose Case:</Form.ControlLabel>
          <Form.Control name="pType" accepter={SelectPicker} data={pTypeData} rule={ruleRequire} />
          <Form.HelpText>Required</Form.HelpText>
        </Form.Group>
        {
          formValue?.pType !== 'create'
          && (
            <Form.Group controlId="canisterId">
              <Form.ControlLabel>CanisterId</Form.ControlLabel>
              <Form.Control name="canisterId" value={formValue.canisterId} rule={ruleRequire} />
              <Form.HelpText>Required</Form.HelpText>
            </Form.Group>
          )
        }
        {
          formValue?.pType === 'install'
          && (
            <Form.Group>
              <Form.ControlLabel>WASM Code</Form.ControlLabel>
              <Uploader 
                accept='.wasm' action="" 
                autoUpload={false} 
                onChange={files=>{formValue.wasm_code = (files?.[0]?.blobFile || null)}}
              />                
            </Form.Group>
          )
        }
        <Form.Group>
          <ButtonToolbar>
            <Button appearance="primary" onClick={onSubmit}>Submit</Button>
            <Button appearance="default" onClick={handleOpen}>Cancel</Button>
          </ButtonToolbar>
        </Form.Group>      
      </Form>
      <CSSTransition in={formValue.pType === 'create'} classNames="fade" timeout={300} unmountOnExit>
        <div className='propose-createImg' style={{backgroundImage:`url(${ImgBarrel4})`}}></div>
      </CSSTransition>
      <Modal backdrop="static" role="alertdialog" open={open} onClose={handleClose} size="xs">
        <Modal.Body>
          Once you choose [YES], tha app will return to the [HOME] page, and the data in the form will be lost forver.
          Are you sure you want to proceed ?
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onCancel} appearance="primary">
            [Yes] I wanna leave.
          </Button>
          <Button onClick={handleClose} appearance="subtle">
            [No] Let me reconsider.
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}