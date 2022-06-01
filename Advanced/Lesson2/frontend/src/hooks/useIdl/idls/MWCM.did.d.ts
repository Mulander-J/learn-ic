import type { Principal } from '@dfinity/principal';
export interface AuthCanister { 'cid' : Principal, 'auth' : boolean }
export type Member = Principal;
export interface Proposal {
  'id' : ProposalId,
  'settled' : boolean,
  'canister_id' : [] | [Principal],
  'proposer' : Member,
  'pType' : ProposalType,
  'approvers' : Array<Member>,
  'wasm_code' : [] | [Array<number>],
}
export type ProposalId = string;
export type ProposalType = { 'auth' : null } |
  { 'stop' : null } |
  { 'delete' : null } |
  { 'create' : null } |
  { 'start' : null } |
  { 'install' : null };
export type Result = { 'ok' : string } |
  { 'err' : string };
export interface anon_class_16_1 {
  'acceptCycles' : () => Promise<bigint>,
  'canisters' : () => Promise<Array<AuthCanister>>,
  'getAuthCanister' : (arg_0: Principal) => Promise<[] | [AuthCanister]>,
  'getCycles' : () => Promise<bigint>,
  'getProposes' : (arg_0: ProposalId) => Promise<[] | [Proposal]>,
  'groups' : () => Promise<Array<Member>>,
  'passNum' : () => Promise<bigint>,
  'propose' : (
      arg_0: ProposalType,
      arg_1: [] | [Principal],
      arg_2: [] | [Array<number>],
    ) => Promise<Result>,
  'proposes' : () => Promise<Array<Proposal>>,
  'vote' : (arg_0: ProposalId, arg_1: boolean) => Promise<Result>,
}
export interface _SERVICE extends anon_class_16_1 {}
