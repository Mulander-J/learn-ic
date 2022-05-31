import React from "react"
import { useNavigate, useLocation } from "react-router-dom"

import { ConnectButton, useConnect } from "@connect2ic/react"
import { Navbar, Nav } from 'rsuite'

import UserAvatar from '@/components/UserAvatar'
import { homeNav, menus } from '@/routes/routes'
import logo from "@img/dfinity.svg"

export default function AppNav () {
  const navigate  = useNavigate()
  const location = useLocation()
  const { principal, isConnected } = useConnect()
  return (
    <Navbar appearance="inverse">
      <Navbar.Header className="app-brand">
        <img src={logo} alt="logo" onClick={()=>{navigate(homeNav.path)}}/>
      </Navbar.Header>
      <Navbar.Body>
        <Nav activeKey={location?.pathname} onSelect={navigate}>
          {menus.map(m=><Nav.Item eventKey={m.path}>{m?.meta?.title}</Nav.Item>)}
        </Nav>
        <Nav pullRight>
          <Nav.Item className="app-connect">
            {isConnected && <UserAvatar principal={ principal } />}
            <ConnectButton dark />
          </Nav.Item>              
        </Nav>
      </Navbar.Body>
    </Navbar>
  )
}