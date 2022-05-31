import React from "react"
import useClipboard from "react-use-clipboard"
import { Copy, CopySuccess } from 'iconsax-react'
import { Avatar, Stack } from 'rsuite'
import { strSlice } from '@/utils'

function UserAvatar(props: any){
  const { principal } = props

  if(!principal) return null

  const [isCopied, setCopied] = useClipboard(principal, { successDuration: 1000 })
  const avatarSrc = ''
  // const avatarSrc = `https://api.multiavatar.com/${principal}.svg`

  return (
    <Stack spacing={6}>
      <Avatar src={avatarSrc} alt="@multiavatar" circle />
      { principal && <p className="font-bold cursor-default">{strSlice(principal)}</p> }
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