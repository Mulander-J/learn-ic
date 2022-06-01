export const idlFactory = ({ IDL }) => {
  const AuthCanister = IDL.Record({ 'cid' : IDL.Principal, 'auth' : IDL.Bool });
  const ProposalId = IDL.Text;
  const Member = IDL.Principal;
  const ProposalType = IDL.Variant({
    'auth' : IDL.Null,
    'stop' : IDL.Null,
    'delete' : IDL.Null,
    'create' : IDL.Null,
    'start' : IDL.Null,
    'install' : IDL.Null,
  });
  const Proposal = IDL.Record({
    'id' : ProposalId,
    'settled' : IDL.Bool,
    'canister_id' : IDL.Opt(IDL.Principal),
    'proposer' : Member,
    'pType' : ProposalType,
    'approvers' : IDL.Vec(Member),
    'wasm_code' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const Result = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const anon_class_16_1 = IDL.Service({
    'acceptCycles' : IDL.Func([], [IDL.Nat], []),
    'canisters' : IDL.Func([], [IDL.Vec(AuthCanister)], ['query']),
    'getAuthCanister' : IDL.Func(
        [IDL.Principal],
        [IDL.Opt(AuthCanister)],
        ['query'],
      ),
    'getCycles' : IDL.Func([], [IDL.Nat], ['query']),
    'getProposes' : IDL.Func([ProposalId], [IDL.Opt(Proposal)], ['query']),
    'groups' : IDL.Func([], [IDL.Vec(Member)], ['query']),
    'passNum' : IDL.Func([], [IDL.Nat], ['query']),
    'propose' : IDL.Func(
        [ProposalType, IDL.Opt(IDL.Principal), IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result],
        [],
      ),
    'proposes' : IDL.Func([], [IDL.Vec(Proposal)], ['query']),
    'vote' : IDL.Func([ProposalId, IDL.Bool], [Result], []),
  });
  return anon_class_16_1;
};
export const init = ({ IDL }) => { return [IDL.Vec(IDL.Principal), IDL.Nat]; };
