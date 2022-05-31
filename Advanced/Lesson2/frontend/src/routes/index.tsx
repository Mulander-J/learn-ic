import React, { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import LoadingError from '@/components/LoadingError'

const PageHome = lazy(async () => import('./../pages/home'))
const PageGroups = lazy(async () => import('./../pages/groups'))
const PageProposals = lazy(async () => import('./../pages/proposals'))
const PageCanisters = lazy(async () => import('./../pages/canisters'))

export default function Routers () {
  const location = useLocation()
  return (    
    <TransitionGroup component={null}>
      <CSSTransition key={location?.key} classNames="fade" timeout={300}>
        <Suspense fallback={<LoadingError />}>
          <Routes location={location}>
            <Route path="/" element={<PageHome />} />
            <Route path='/groups' element={<PageGroups/>} />
            <Route path='/proposals' element={<PageProposals/>}/>
            <Route path='/canisters' element={<PageCanisters/>} />
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