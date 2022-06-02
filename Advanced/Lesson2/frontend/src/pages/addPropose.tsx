import React from 'react'
import { useNavigate } from "react-router-dom"
import { Modal, Form, ButtonToolbar, Button, SelectPicker, Message, toaster } from 'rsuite'

const pTypeData = [
  {
    "label": "Eugenia",
    "value": "Eugenia"
  },
  {
    "label": "Eugenia2",
    "value": "Eugenia2"
  },
]

export default function AddPropose() {
  const navigate = useNavigate()

  const [open, setOpen] = React.useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const onCancel = () => { 
    handleClose()
    navigate('/') 
  }
  const onSubmit = ()=>{
    handleClose()
    toaster.push(<Message showIcon type="info">You Click Yes</Message>)
  }


  return (
    <div className="page-wrapper page-center page-propose">
      <h2 className="app-title1">Propose</h2>
      <section className="propose-cover"></section>
      <Form layout="horizontal">
        <Form.Group controlId="pType">
          <Form.ControlLabel>Propose Case:</Form.ControlLabel>
          <Form.Control name="pType" accepter={SelectPicker} data={pTypeData} />
        </Form.Group>
        <Form.Group controlId="canisterId">
          <Form.ControlLabel>CanisterId</Form.ControlLabel>
          <Form.Control name="canisterId" />
          <Form.HelpText>Required</Form.HelpText>
        </Form.Group>
        <Form.Group controlId="wasm_code">
          <Form.ControlLabel>WASM Code</Form.ControlLabel>
          <Form.Control name="wasm_code" type="email" />
          <Form.HelpText tooltip>Required</Form.HelpText>
        </Form.Group>
        <Form.Group controlId="wasm_sha256">
          <Form.ControlLabel>WASM Code SHA256</Form.ControlLabel>
          <Form.Control name="wasm_sha256" type="email" />
          <Form.HelpText tooltip>Required</Form.HelpText>
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