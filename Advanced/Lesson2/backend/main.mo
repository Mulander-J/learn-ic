import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Cycles "mo:base/ExperimentalCycles";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import SHA256 "./modules/SHA256";
import HEX "./modules/HEX";
import IC "./modules/ic";

/**
* Multi-Wallet Canister Manager
*/
actor class (_g : [Principal], _pn : Nat) = self {
  /*  globle type */

  public type Member = Principal;
  public type ProposalId = Text;
  public type ProposalType = {
    #auth;
    #create;
    #delete;  
    #install;
    #start;
    #stop;
    #join;
    #leave;
  };
  public type Proposal = {
    id : ProposalId;
    proposer : Member;
    pType: ProposalType;
    canister_id : ?Principal;
		wasm_code :  ?Blob;
    wasm_sha256: ?Text;
    approvers : [Member];
    settled : Bool;
  };
  public type AuthCanister = {
    cid : Principal;
    auth : Bool;
  };
  /*  Vars  */
  private stable var g = _g;
  private stable var pn = _pn;
  //  all cansiters
  private stable var _canisterEntries : [(Principal, AuthCanister)] = [];
  private var _canisterMap = HashMap.fromIter<Principal, AuthCanister>(_canisterEntries.vals(), 10, Principal.equal, Principal.hash);
  //  all proposals
  private stable var _nextId : Nat = 1;
  private stable var _proposeEntries : [(ProposalId, Proposal)] = [];
  private var _proposeMap = HashMap.fromIter<ProposalId, Proposal>(_proposeEntries.vals(), 10, Text.equal, Text.hash);

  /*  getter  */

  public query func passNum() : async Nat { pn; };
  public query func groups() : async [Member] { g; };
  public query func canisters() : async [AuthCanister] {
    Iter.toArray(_canisterMap.vals());
  };
  public query func proposes() : async ([Proposal], Nat, Nat) {
    (
      Iter.toArray(_proposeMap.vals()),
      g.size(),
      pn
    )
  };
  public query func getAuthCanister(id : Principal) : async ?AuthCanister {
    _canisterMap.get(id)
  };
  public query func getProposes(id : ProposalId) : async ?Proposal {
    _proposeMap.get(id)
  };
  public func checkCanisters(canister_id : Principal) : async IC.canisterStats {
    assert(_existCanister(canister_id));
    let _ic : IC.Self = actor("aaaaa-aa");
    await _ic.canister_status({canister_id});
  };

  /*  Cycle  */
  
  public query func getCycles() : async Nat {
    Cycles.balance();
  };
  public func acceptCycles() : async Nat {
    return Cycles.accept(Cycles.available());
  };

  /*  hooks */

  private func _sha256ToHex(_b : Blob) : Text {
    HEX.encode(SHA256.sha256(Blob.toArray(_b)));
  };
  private func _isMember(member : Member) : Bool {
    // true;
    if(g.size() <= 0) { return false; };
    Option.isSome(Array.find<Member>(g, func (a) : Bool { Principal.equal(a, member)}))
  };
  private func _existCanister(canister_id : Principal) : Bool {
    Option.isSome(_canisterMap.get(canister_id));
  };
  private func _duplicateProposal(pType : ProposalType, canister_id: Principal) : Bool {
    let _arr = Iter.toArray(_proposeMap.vals());
    Option.isSome(Array.find<Proposal>(
      _arr, 
      func (a) : Bool { 
        switch(a.canister_id){
          case(?id){
            Principal.equal(id, canister_id) 
              and (a.pType == pType)
              and (not a.settled);
          };
          case null { false }
        };
      }
    ));
  };
  private func checkThreashhold(proposal : Proposal) : Bool {
    let initLimit = (g.size() < pn);
    switch (proposal.pType) {
      case (#create or #leave or #join) {
        return initLimit or (proposal.approvers.size() >= pn);
      };
      case _ {
        switch (proposal.canister_id) {
          case (?id) {
            switch (_canisterMap.get(id)) { 
              case (?canister) {
                if (canister.auth) {
                  return initLimit or (proposal.approvers.size() >= pn);
                }else{
                  return true
                };
              };
              case null { return false };
            };
          };
          case null { return false };
        };        
      };
    };
  };
  private func handleCanister(p : Proposal) : async Result.Result<Text, Text> {
    let _ic : IC.Self = actor("aaaaa-aa");
    switch (p.canister_id) {
      case (?canister_id) {
        switch (p.pType) {
          case (#auth) {
            switch (_canisterMap.get(canister_id)) {
              case (?canister) {
                _canisterMap.put(canister_id, {
                  cid = canister_id;
                  auth = not canister.auth;
                });
                _proposeMap.put(p.id, settleVote(p));
                return #ok("AUTH TRIGGER");
              };
              case null { return #err("CANISTER NOt FOUND"); };
            };
          };
          case (#install) {
            switch (p.wasm_code) {
              case (?wasm_code) {
                await _ic.install_code({
                  arg = [];
                  wasm_module = Blob.toArray(wasm_code);
                  mode = #install;
                  canister_id;           
                });
                _proposeMap.put(p.id, settleVote(p));
                return #ok("CANISTER INSTALL") 
              };
              case null { return #err("LOST WASM_CODE"); };
            };
          };
          case (#start) {
            await _ic.start_canister({ canister_id });
            _proposeMap.put(p.id, settleVote(p));
            return #ok("CANISTER START")   
          };
          case (#stop) {
            await _ic.stop_canister({ canister_id });
            _proposeMap.put(p.id, settleVote(p));
            return #ok("CANISTER STOP")   
          };
          case (#delete) {
            await _ic.delete_canister({ canister_id });
            _proposeMap.put(p.id, settleVote(p));
            return #ok("CANISTER DELETE")  
          };
          case _ { return #ok("NOTHING HAPPEN"); };
        };
      };
      case null { return #err("LOST CANISTER_ID"); };
    };
  };
  private func handleGroup(p: Proposal) : async Result.Result<Text, Text> {
    let pType = p.pType;
    assert(pType == #leave or pType == #join);
    switch(p.canister_id){
      case(?canister_id){
        let id = Principal.toText(canister_id);
        _proposeMap.put(p.id, settleVote(p));
        if(pType == #leave){
          if(g.size() == 1){ return #err("MEMBER.TOL AT LEAST 1") };
          g := Array.filter<Member>(g, func(a) {not Principal.equal(a, canister_id)});           
          return #ok("MEMBER LEFT: " #id);
        }else{
          if (Option.isSome(Array.find<Member>(g, func(a) {a == canister_id}))) {
            return #ok("MEMBER ALREADY EXIST: " #id);
          };
          if(g.size() > pn){ pn += 1; };
          g := Array.append<Member>(g, [canister_id]);
          return #ok("MEMBER JOINED: " #id);
        }        
      };
      case null { return #err("LOST ID"); };
    };    
  };
  private func updateVote(m : Member, p : Proposal, b : Bool) : Proposal {
    {
      id = p.id;
      pType = p.pType;
      proposer = p.proposer;
      canister_id = p.canister_id;
      wasm_code = p.wasm_code;
      wasm_sha256 = p.wasm_sha256;
      settled = p.settled;
      // update approvers only
      approvers = if (b) {
        //  add vote
        if (Option.isSome(Array.find<Member>(p.approvers, func(a) {a == m}))) {
          //  alreay voted
          p.approvers;
        } else {
          //  new vote
          Array.append<Member>(p.approvers, [m]);
        };
      } else {
        //  revoke vote 
        Array.filter<Member>(p.approvers, func(a) {not Principal.equal(a,m)});
      };
    }
  };
  private func settleVote(p : Proposal) : Proposal {
    {
      id = p.id;
      pType = p.pType;
      proposer = p.proposer;
      canister_id = p.canister_id;
      wasm_code = p.wasm_code;
      wasm_sha256 = p.wasm_sha256;
      settled = true;
      approvers = p.approvers
    }
  };
  public func checkJoinRejct(member: Member) : async Bool {
    if(_isMember(member)) return true;
    return _duplicateProposal(#join, member);
  };

  // public func test(_b : Blob) : async (Bool, Text) {
  //   let hex = HEX.encode(SHA256.sha256(Blob.toArray(_b)));
  //   return (
  //     hex == "bf1b5fff842700e36a1a4489996d214dab15e90f792b72b08bc7812431dcdba2",
  //     hex
  //   )
  // };

  /*  update  */

  public shared({ caller }) func propose (pType : ProposalType, canister_id: ?Principal, wasm_code : ?Blob) : async Result.Result<Text, Text> {
    //  check auth
    if( not _isMember(caller) and pType != #join ){ return #err("YOU ARE NOT MEMBER"); };
    
    var wasm_sha256 = "";

    //  check params
    if (pType != #create) {
      switch (canister_id) {
        case (?id) {
          if (_duplicateProposal(pType, id)) { return #err("PROPOSAL IS DUPLICATE") };
          if (not _existCanister(id) and (pType != #join and pType != #leave)) { return #err("CANSITER IS NOT FOUND") }; 
        };
        case null { return #err("LOST CANISTER"); };
      };
      if (pType == #install) {
        switch (wasm_code) {
          case (?code) { 
            // wasm_sha256 := _sha256ToHex(code);
            wasm_sha256 := "sha256ToHex(code)";
          };
          case null { return #err("LOST WASM_CODE"); };
        };
      };
    };
    //  get nextId
    let id = Nat.toText(_nextId);
    //  add propose
    _proposeMap.put(id, {
      id;
      proposer = caller;
      pType;
      canister_id;
      wasm_code;
      wasm_sha256 = ?wasm_sha256;
      approvers = [];
      settled = false;
    });
    //  increment nextId
    _nextId += 1;
    //  success
    #ok(id);
  };
  public shared({ caller }) func vote (id : ProposalId, chosen : Bool) : async Result.Result<Text, Text> {
    //  check auth
    if (not _isMember(caller)) { return #err("YOU ARE NOT MEMBER"); };
    //  update vote after find the proposal
    switch (_proposeMap.get(id)) {
      case (?proposal) {
        //  check settled
        if (proposal.settled) { return #ok("PROPOSAL IS SETTLED"); };
        //  update vote
        let newProposal = updateVote(caller, proposal, chosen);
        _proposeMap.put(id, newProposal);
        //  check threashhold
        let _next = checkThreashhold(newProposal);
        if(not _next){ return #ok(if(chosen){"Vote Added"}else{"Vote Revoked"}); };
        //  meet threashhold
        if (proposal.pType == #join or proposal.pType == #leave) {
          await handleGroup(newProposal);
        } else if (proposal.pType == #create) {
          let settings = {
            freezing_threshold = null;
            controllers = ?[Principal.fromActor(self)];
            memory_allocation = null;
            compute_allocation = null;
          };
          let _ic : IC.Self = actor("aaaaa-aa");
          Cycles.add(120000000000);
          let result = await _ic.create_canister({ settings = ?settings;});
          let cid = result.canister_id;
          _canisterMap.put(cid, { cid; auth = true; });
          _proposeMap.put(id, settleVote(newProposal));
          return #ok("CANISTER CREATE ! " #Principal.toText(cid))  
        } else {          
          await handleCanister(newProposal);  
        };
      };
      case null{ return #err("PROPOSAL NOT FOUND"); };
    };    
  };

  /*System Update*/

  system func preupgrade() {
    _canisterEntries := Iter.toArray(_canisterMap.entries());
    _proposeEntries := Iter.toArray(_proposeMap.entries());
  };

  system func postupgrade() {
    _canisterEntries := [];
    _proposeEntries := [];
  };
};