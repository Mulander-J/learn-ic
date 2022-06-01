import React from 'react'
import { Placeholder } from 'rsuite'
export default function HolderBlock(){
  return (
    <div className="grid gap-4 my-2">
      <p className="text-green-400">ic is working hard to fetching data...</p>
      <Placeholder graph="circle" />
      <Placeholder graph="circle" />
      <Placeholder graph="circle" />
    </div>
  )
}