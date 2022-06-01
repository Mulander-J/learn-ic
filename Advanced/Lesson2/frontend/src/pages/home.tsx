import React from "react"
import LinkBtn from "@/components/LinkBtn"
import { APP_NAME } from '@/utils/constant'

export default function PageHome() {
  return (
    <div className="grid text-center justify-center items-center h-full w-full">
      <h1 className="text-3xl font-phattype">{APP_NAME}</h1>      
      <p className="text-lg">Welcome to {APP_NAME}.<br/>Every menber has the right to vote for the proposal of canister's action.<br/>Come & enjoy the fun.</p>
      <LinkBtn name="proposal">Start</LinkBtn>
    </div>
  )
}