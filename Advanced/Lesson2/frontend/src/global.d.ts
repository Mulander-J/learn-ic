
interface ImportMetaEnv {
  readonly VITE_APP_DFX_NETWORK: string
  readonly VITE_APP_CID_MWCM: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'react-transition-group'