import React from "react"
import { Container, Header, Content, Footer } from 'rsuite'
import { ConnectDialog } from "@connect2ic/react"
import AppNav from '@/components/AppNav'
import Routers from '@/routes/index'

const twitter = 'MulanderKilig'

function App() {

  return (
    <Container className="App">
      <Header>
        <AppNav />
      </Header>
      <Content>
        <Routers />
      </Content>
      <Footer className="app-footer">
        <span>by <a target="_blank" href={`https://twitter.com/${twitter}`}>@{twitter}</a></span>
      </Footer>
      <ConnectDialog dark />
    </Container>
  )
}

export default App
