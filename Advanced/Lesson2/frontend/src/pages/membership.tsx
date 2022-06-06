import React, { useCallback, useState } from 'react'
import { Principal } from '@dfinity/principal'
import { useNavigate } from "react-router-dom"
import { errHandle } from "@/utils"
import { useCanister, useConnect } from "@connect2ic/react"
import { Modal, Form, ButtonToolbar, Button, Message, toaster, Loader } from 'rsuite'

const initFormValue = {
  principal: '',
  name: '',
  email: '',
  reason: '',
}

export default function Membership() {
  const navigate = useNavigate()
  const { isConnected, principal } = useConnect()  
  const [MWCM] = useCanister("MWCM")

  const [open, setOpen] = useState(false)
  const [ isLoading, setLoad ] = useState(false)
  const [formValue, setFormValue] = useState<any>(initFormValue);

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const onCancel = () => { 
    handleClose()
    navigate('/') 
  }
  const onSubmit = useCallback(async ()=>{
    if(isLoading) return
    if(!isConnected){
      toaster.push(<Message showIcon type="warning">Please Connect!</Message>)
      return null
    }
    try{
      setLoad(true)
      let _pri = Principal.fromText(String(principal)) 
      const res = await MWCM.checkJoinRejct(_pri)
      if(res) {
        toaster.push(<Message showIcon type="info">The application failed, perhaps you have already submitted an application or are already a member.</Message>)
        return null
      }
      await MWCM.propose({join:null}, [_pri], [], [])
      toaster.push(<Message showIcon type="info">Application Sent.</Message>)
    }catch(err: any){
      const msg = errHandle(err)
      toaster.push(<Message showIcon type="error">{msg}</Message>)
      return null
    }finally{
      setLoad(false)
    }
  },[MWCM,isConnected,formValue,isLoading,principal])


  return (
    <div className="page-wrapper page-center">
      <h2 className="app-title1">Application for Membership</h2>
      {  isLoading && <Loader style={{zIndex:'10'}} content="loading..." size="md" backdrop center vertical /> }
      <Form fluid model={formValue} onChange={formValue => setFormValue(formValue)}>
        <Form.Group controlId="principal">
          <Form.ControlLabel>Principal</Form.ControlLabel>
          <Form.Control name="principal" value={principal?.toString()} plaintext />
        </Form.Group>
        <Form.Group controlId="name">
          <Form.ControlLabel>Name</Form.ControlLabel>
          <Form.Control name="name" value={formValue.name} />
          <Form.HelpText>Required</Form.HelpText>
        </Form.Group>
        <Form.Group controlId="email">
          <Form.ControlLabel>Email</Form.ControlLabel>
          <Form.Control name="email" value={formValue.email} />
          <Form.HelpText>Required</Form.HelpText>
        </Form.Group>
        <Form.Group controlId="reason">
          <Form.ControlLabel>Reason</Form.ControlLabel>
          <Form.Control name="reason" value={formValue.reason} />
          <Form.HelpText>Required</Form.HelpText>
        </Form.Group>                        
        <Form.Group>
          <ButtonToolbar>
            <Button appearance="primary" onClick={onSubmit}>Submit</Button>
            <Button appearance="default" onClick={handleOpen}>Cancel</Button>
          </ButtonToolbar>
        </Form.Group>
      </Form>
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