import React from 'react'
import { useNavigate } from "react-router-dom"
import { findMenu } from "@/routes/routes"

export default function LinkBtn(props: any) {
  const { name, isIcon = false, children } = props
  const nav = findMenu(name)
  const navigate = useNavigate()
  const clickStart = ()=>{ nav && navigate(nav?.path) }
  return <div className={isIcon?'app-IconBtn':'app-btn'} onClick={clickStart}>{children}</div>
}