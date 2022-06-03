import React, { useCallback, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { CSSTransition } from 'react-transition-group'
import { errHandle } from "@/utils"
import { useCanister, useConnect } from "@connect2ic/react"
import { Modal, Form, ButtonToolbar, Button, SelectPicker, Message, toaster } from 'rsuite'
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
  wasm_code: '',
  wasm_sha256: '',
}

export default function AddPropose() {
  const navigate = useNavigate()
  const { isConnected } = useConnect()
  const [MWCM] = useCanister("MWCM")

  const [open, setOpen] = useState(false)
  const [formValue, setFormValue] = useState<any>(initFormValue);

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const onCancel = () => { 
    handleClose()
    navigate('/') 
  }
  const onSubmit = useCallback(()=>{
    if(!isConnected){
      toaster.push(<Message showIcon type="warning">Please Connect!</Message>)
      return null
    }
    try{
      console.log('[formValue]', formValue)
      toaster.push(<Message showIcon type="info">Nothing happens.</Message>)
      // navigate('/') 
    }catch(err: any){
      const msg = errHandle(err)
      toaster.push(<Message showIcon type="error">{msg}</Message>)
      return null
    }
  },[MWCM,isConnected,formValue])


  return (
    <div className="page-wrapper page-center page-propose">
      <h2 className="app-title1">Propose</h2>
      <section className="propose-cover"></section>
      <Form className='bg-black bg-opacity-40 py-4 px-8 rounded-lg' fluid model={formValue} onChange={formValue => setFormValue(formValue)}>
        <Form.Group controlId="pType">
          <Form.ControlLabel>Propose Case:</Form.ControlLabel>
          <Form.Control name="pType" accepter={SelectPicker} data={pTypeData} />
          <Form.HelpText>Required</Form.HelpText>
        </Form.Group>
        {
          formValue?.pType !== 'create'
          && (
            <Form.Group controlId="canisterId">
              <Form.ControlLabel>CanisterId</Form.ControlLabel>
              <Form.Control name="canisterId" value={formValue.canisterId} />
              <Form.HelpText>Required</Form.HelpText>
            </Form.Group>
          )
        }
        {
          formValue?.pType === 'install'
          && (
            <>
              <Form.Group controlId="wasm_code">
                <Form.ControlLabel>WASM Code</Form.ControlLabel>
                <Form.Control name="wasm_code" />
                <Form.HelpText tooltip>Required</Form.HelpText>
              </Form.Group>
              <Form.Group controlId="wasm_sha256">
                <Form.ControlLabel>WASM Code SHA256</Form.ControlLabel>
                <Form.Control name="wasm_sha256" />
                <Form.HelpText tooltip>Required</Form.HelpText>
              </Form.Group>
            </>
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