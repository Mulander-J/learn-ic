import React from "react"
import { Container, Header, Content, Footer } from 'rsuite'
import { ConnectDialog } from "@connect2ic/react"
import AppNav from '@/components/AppNav'
import Routers from '@/routes/index'
import { AUTHOR_TWITTER } from '@/utils/constant'

function App() {
  return (
    <Container className="App">
      <Header>
        <AppNav />
      </Header>
      <Content className="overflow-auto">
        <Routers />
      </Content>
      <Footer className="app-footer">
        <span>by <a target="_blank" href={`https://twitter.com/${AUTHOR_TWITTER}`}>@{AUTHOR_TWITTER}</a></span>
      </Footer>
      <ConnectDialog dark />
    </Container>
  )
}

export default App
