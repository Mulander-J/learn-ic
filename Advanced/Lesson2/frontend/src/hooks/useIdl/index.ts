import { Actor, HttpAgent } from "@dfinity/agent"
import { idlFactory as idlMWCM } from './idls/MWCM.did.js'
import { CID_MWCM } from './cids'

export const canisters = {
  MWCM : {
    canisterId: CID_MWCM,
    idlFactory: idlMWCM
  }
}

export const createActor = (canisterId:string, idl: any, options?:any) => {
  const agent = new HttpAgent({ ...options?.agentOptions });
  
  // Fetch root key for certificate validation during development
  // if(process.env.NODE_ENV !== "production") {
  //   agent.fetchRootKey().catch(err=>{
  //     console.warn("Unable to fetch root key. Check to ensure that your local replica is running");
  //     console.error(err);
  //   });
  // }

  // Creates an actor with using the candid interface and the HttpAgent
  return Actor.createActor(idl, {
    agent,
    canisterId,
    ...options?.actorOptions,
  });
};

export const ActorMWCN = createActor(canisters.MWCM.canisterId, canisters.MWCM.idlFactory)
