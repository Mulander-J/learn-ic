/*  React  */
import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter } from "react-router-dom"
/*  connect2ic  */
import {  
  InternetIdentity,
  AstroX, NFID
} from "@connect2ic/core/providers"
import { Connect2ICProvider } from "@connect2ic/react"
import "@connect2ic/core/style.css"
/*  rsuite  */
import { CustomProvider } from 'rsuite'
import 'rsuite/dist/rsuite.min.css'
/*  App */
import "./styles/index.css"
import App from "./App"

const providers = [
  InternetIdentity,
  AstroX,
  NFID
]
const host = window.location.origin

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Connect2ICProvider providers={providers} host={host}>
        <CustomProvider theme="high-contrast">
          <App />
        </CustomProvider>     
      </Connect2ICProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root"),
)
