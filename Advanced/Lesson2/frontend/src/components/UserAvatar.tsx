import React from "react"
import useClipboard from "react-use-clipboard"
import { Copy, CopySuccess } from 'iconsax-react'
import { Avatar, Stack } from 'rsuite'
import { strSlice } from '@/utils'

const avararBase = (id:string) => {
  return import.meta.env.VITE_APP_DFX_NETWORK === 'ic' ? `https://api.multiavatar.com/${id}.svg` : id
}

function UserAvatar(props: any){
  const { principal, hideAvatar = false } = props

  if(!principal) return null

  const _text = principal?._isPrincipal ? principal.toString() : principal

  const [isCopied, setCopied] = useClipboard(_text, { successDuration: 1000 })  

  return (
    <Stack spacing={6}>
      { !hideAvatar && <Avatar src={avararBase(_text)} alt="@multiavatar" circle /> }
      { _text && <p className="font-bold cursor-default">{strSlice(_text)}</p> }
      <div className="mr-2 cursor-pointer" onClick={()=>{!isCopied && setCopied()}}>
        { isCopied
          ? <CopySuccess size="32" color="#37d67a" variant="TwoTone"/> 
          : <Copy size="32" color="#37d67a" variant="TwoTone"/> 
        }
      </div>
    </Stack>
  )
}

export default UserAvatar