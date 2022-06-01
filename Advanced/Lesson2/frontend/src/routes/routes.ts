type routeMenu = {
  path:string,
  name:string,
  meta?:{
    title?:string
  }
}


export const homeNav : routeMenu =   { 
  path:'/',
  name: 'home',
  meta: {
    title:'Home'
  }
}

export const menus: routeMenu [] = [
  { 
    path:'/groups',
    name: 'group',
    meta: {
      title:'Group'
    }
  },
  { 
    path:'/proposals',
    name: 'proposal',
    meta: {
      title:'Proposal'
    }
  },
  { 
    path:'/canisters',
    name: 'canister',
    meta: {
      title:'Canister'
    }
  },
  { 
    path:'/propose',
    name: 'propose',
    meta: {
      title:'Propose'
    }
  },
]

export const findMenu = (name:string):routeMenu|any => menus.find(e=>e.name===name)