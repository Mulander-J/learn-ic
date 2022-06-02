/*  React  */
import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter } from "react-router-dom"
/*  connect2ic  */
import { Connect2ICProvider } from "@connect2ic/react"
import { 
  InternetIdentity, AstroX, NFID, 
  // PlugWallet
} from "@connect2ic/core/providers"
import "@connect2ic/core/style.css"
import { canisters } from '@/hooks/useIdl'
/*  rsuite  */
import { CustomProvider } from 'rsuite'
import 'rsuite/dist/rsuite.min.css'
/*  App */
import "./styles/index.css"
import App from "./App"

const host = window.location.origin
const providers = [
  InternetIdentity,
  AstroX,
  NFID,
  // PlugWallet
]


ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Connect2ICProvider host={host} providers={providers} canisters={canisters}>
        <CustomProvider theme="high-contrast">
          <App />
        </CustomProvider>     
      </Connect2ICProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root"),
)
