import React from "react"
import LinkBtn from "@/components/LinkBtn"
import { APP_NAME } from '@/utils/constant'

const videoUrl = 'https://cdn-animation.artstation.com/p/video_sources/000/195/321/comp-2-1.mp4'
const posterUrl = 'https://cdnb.artstation.com/p/assets/images/images/032/481/177/large/nelson-tai-hand-dsgn-a-001e.jpg?1606577339'

export default function PageHome() {
  return (
    <div className="app-home">     
      <h1 className="text-3xl font-grouns">{APP_NAME}</h1>            
      <LinkBtn name="proposal">Start</LinkBtn>
      <section>
        <p className="text-lg">Welcome to {APP_NAME}.<br/>Every menber has the right to vote for the proposal of canister's action.<br/>Come & enjoy the fun.</p>
        <video className="app-vMask" autoPlay muted loop poster={posterUrl}>
          <source src={videoUrl} />
        </video>        
      </section>
    </div>
  )
}