export const APP_NAME = 'Uptown DAO'

export const AUTHOR_TWITTER = 'MulanderKilig'

export const pTypeInfo : any = {
  'auth':{
    color:'yellow',
    desc: 'Trigger if this canister require multi-sign'
  },
  'stop':{
    color:'orange',
    desc: 'Stop this canister'
  },
  'delete':{
    color: 'red',
    desc: 'Delete this canister'
  },
  'create': {
    color: 'cyan',
    desc: 'Create a new canister'
  },
  'start':{
    color: 'green',
    desc: 'Start this canister'
  },
  'install': {
    color: 'violet',
    desc: 'Install code to this canister'
  }
}