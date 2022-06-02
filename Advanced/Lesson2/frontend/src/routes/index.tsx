import React, { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import LoadingError from '@/components/LoadingError'

const PageHome = lazy(async () => import('./../pages/home'))
const PageGroups = lazy(async () => import('./../pages/groups'))
const PageProposals = lazy(async () => import('./../pages/proposals'))
const PageCanisters = lazy(async () => import('./../pages/canisters'))
const PagePropose = lazy(async () => import('./../pages/addPropose'))

export default function Routers () {
  const location = useLocation()
  return (    
    <TransitionGroup>
      <CSSTransition key={location?.key} classNames="fade" timeout={300} unmountOnExit>
        <Suspense fallback={<LoadingError />}>
          <Routes location={location}>
            <Route path="/" element={<PageHome />} />
            <Route path='/groups' element={<PageGroups/>} />
            <Route path='/proposals' element={<PageProposals/>}/>
            <Route path='/canisters' element={<PageCanisters/>} />
            <Route path='/propose' element={<PagePropose/>} />
            <Route path="*" element={<NoMatch />} />
          </Routes>   
        </Suspense>         
      </CSSTransition>
    </TransitionGroup>
  )
}

const NoMatch = () => {
  return <p>There's nothing here: 404!</p>;
};