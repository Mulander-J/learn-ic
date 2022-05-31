import React from "react"
import { useNavigate } from "react-router-dom"
import { findMenu } from "@/routes/routes"

const proposal = findMenu('proposal')

export default function PageHome() {
  const navigate = useNavigate()
  const clickStart = ()=>{ proposal && navigate(proposal?.path) }

  return (
    <div className="grid text-center justify-center items-center h-full w-full">
      <h1 className="text-3xl font-phattype">Uptown DAO</h1>      
      <p className="text-lg">Welcome to Uptown DAO.<br/>Every menber has the right to vote for the proposal of canister's action.<br/>Come & enjoy the fun.</p>      
      <div className="bg-purple-500 hover:bg-purple-600 active:bg-purple-700 leading-5 w-40 mx-auto mt-4 px-5 py-2 text-sm rounded-full font-semibold text-white cursor-pointer" onClick={clickStart}>Start</div>
    </div>
  )
}