export const idlFactory = ({ IDL }) => {
  const AuthCanister = IDL.Record({ 'cid' : IDL.Principal, 'auth' : IDL.Bool });
  const definite_canister_settings = IDL.Record({
    'freezing_threshold' : IDL.Nat,
    'controllers' : IDL.Vec(IDL.Principal),
    'memory_allocation' : IDL.Nat,
    'compute_allocation' : IDL.Nat,
  });
  const canisterStats = IDL.Record({
    'status' : IDL.Variant({
      'stopped' : IDL.Null,
      'stopping' : IDL.Null,
      'running' : IDL.Null,
    }),
    'freezing_threshold' : IDL.Nat,
    'memory_size' : IDL.Nat,
    'cycles' : IDL.Nat,
    'settings' : definite_canister_settings,
    'module_hash' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'idle_cycles_burned_per_second' : IDL.Opt(IDL.Nat),
  });
  const Member = IDL.Principal;
  const ProposalId = IDL.Text;
  const ProposalType = IDL.Variant({
    'auth' : IDL.Null,
    'join' : IDL.Null,
    'stop' : IDL.Null,
    'delete' : IDL.Null,
    'leave' : IDL.Null,
    'create' : IDL.Null,
    'start' : IDL.Null,
    'install' : IDL.Null,
  });
  const Proposal = IDL.Record({
    'id' : ProposalId,
    'settled' : IDL.Bool,
    'canister_id' : IDL.Opt(IDL.Principal),
    'wasm_sha256' : IDL.Opt(IDL.Text),
    'proposer' : Member,
    'pType' : ProposalType,
    'approvers' : IDL.Vec(Member),
    'wasm_code' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const Result = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const anon_class_16_1 = IDL.Service({
    'acceptCycles' : IDL.Func([], [IDL.Nat], []),
    'canisters' : IDL.Func([], [IDL.Vec(AuthCanister)], ['query']),
    'checkCanisters' : IDL.Func([IDL.Principal], [canisterStats], []),
    'checkJoinRejct' : IDL.Func([Member], [IDL.Bool], []),
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
        [
          ProposalType,
          IDL.Opt(IDL.Principal),
          IDL.Opt(IDL.Vec(IDL.Nat8)),
          IDL.Opt(IDL.Text),
        ],
        [Result],
        [],
      ),
    'proposes' : IDL.Func([], [IDL.Vec(Proposal), IDL.Nat, IDL.Nat], ['query']),
    'vote' : IDL.Func([ProposalId, IDL.Bool], [Result], []),
  });
  return anon_class_16_1;
};
export const init = ({ IDL }) => { return [IDL.Vec(IDL.Principal), IDL.Nat]; };
