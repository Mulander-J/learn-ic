export const APP_NAME = 'Uptown DAO'

export const AUTHOR_TWITTER = 'MulanderKilig'

export const pTypeInfo : any = {
  'create': {
    color: 'cyan',
    desc: 'Create a new canister'
  },
  'auth':{
    color:'yellow',
    desc: 'Trigger if this canister require multi-sign'
  },
  'install': {
    color: 'violet',
    desc: 'Install code to this canister'
  },
  'start':{
    color: 'green',
    desc: 'Start this canister'
  },
  'stop':{
    color:'orange',
    desc: 'Stop this canister'
  },
  'delete':{
    color: 'red',
    desc: 'Delete this canister'
  }
}