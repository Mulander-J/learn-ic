import Array "mo:base/Array";
import Blob "mo:base/Blob";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import IC "./modules/ic";

/**
* Multi-Wallet Canister Manager
*/
actor class (g: [Principal], pn: Nat) = self {
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
  };
  public type Proposal = {
    id: ProposalId;
    proposer: Member;
    pType: ProposalType;
    canister_id: ?Principal;
		wasm_code:  ?Blob;
    approvers: [Member];
    settled: Bool;
  };
  public type AuthCanister = {
    cid: Principal;
    auth: Bool;
  };

  /*  Vars  */

  //  all cansiters
  private stable var _canisterEntries : [(Principal, AuthCanister)] = [];
  private var _canisterMap = HashMap.fromIter<Principal, AuthCanister>(_canisterEntries.vals(), 10, Principal.equal, Principal.hash);
  //  all proposals
  private stable var _nextId: Nat = 1;
  private stable var _proposeEntries : [(ProposalId, Proposal)] = [];
  private var _proposeMap = HashMap.fromIter<ProposalId, Proposal>(_proposeEntries.vals(), 10, Text.equal, Text.hash);

  /*  getter  */

  public query func passNum(): async Nat { pn; };
  public query func groups(): async [Member] { g; };
  public query func canisters(): async [AuthCanister] {
    Iter.toArray(_canisterMap.vals());
  };
  public query func proposes(): async [Proposal] {
    Iter.toArray(_proposeMap.vals());
  };
  public query func getAuthCanister(id: Principal): async ?AuthCanister {
    _canisterMap.get(id)
  };
  public query func getProposes(id: ProposalId): async ?Proposal {
    _proposeMap.get(id)
  };

  /*  hooks */

  private func _isMember(member : Member) : Bool {
    true;
    // if(g.size() <= 0) { return false; };
    // Option.isSome(Array.find<Member>(g, func (a) : Bool { Principal.equal(a, member)}))
  };
  private func existCanister(canister_id : Principal) : Bool {
    Option.isSome(_canisterMap.get(canister_id));
  };
  private func checkThreashhold(proposal: Proposal, pType: ProposalType) : Bool {
    switch (pType){
      case (#create) {
        return proposal.approvers.size() >= pn
      };
      case _ {
        switch (_canisterMap.get(Option.unwrap(proposal.canister_id))){
          case (?canister){
            if(canister.auth){
              return proposal.approvers.size() >= pn
            }else{
              return true
            };
          };
          case null { return false; };
        };
      };
    };
  };
  private func updateVote(m : Member, p : Proposal, b : Bool) : Proposal {
    {
      id = p.id;
      pType = p.pType;
      proposer = p.proposer;
      canister_id = p.canister_id;
      wasm_code = p.wasm_code;
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
      } else{
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
      settled = true;
      approvers = p.approvers
    }
  };

  /*  update  */

  public shared({ caller }) func propose (pType : ProposalType, canister_id: ?Principal, wasm_code : ?Blob) : async Result.Result<Text, Text> {
    //  check auth
    assert(_isMember(caller));
    //  check params
    if (pType != #create) {
      switch(canister_id){
        case(?id){
          if(not existCanister(id)){
            return #err("CANSITER IS NOT FOUND")
          };
        };
        case _ {
          return #err("LOST CANISTER")
        };
      };

      if (pType == #install and Option.isNull(wasm_code)) {
        return #err("LOST WASM_CODE")
      };
    };

    let id = Nat.toText(_nextId);

    _proposeMap.put(id, {
      id;
      proposer = caller;
      pType;
      canister_id;
      wasm_code;
      approvers = [];
      settled = false;
    });

    _nextId += 1;

    #ok(id);
  };
  public shared({ caller }) func vote (id: ProposalId, chosen: Bool) : async Result.Result<Text,Text> {
    //  check auth
    assert(_isMember(caller));
    //  update vote after find the proposal
    switch(_proposeMap.get(id)){
      case(?proposal){
        //  check settled
        if (proposal.settled) { return #ok("PROPOSAL IS SETTLED") };
        //  update vote
        let newProposal = updateVote(caller, proposal, chosen);
        _proposeMap.put(id, newProposal);
        // check threashhold
        let _next = checkThreashhold(newProposal, proposal.pType);
        if(not _next){
          return #ok(if(chosen){"Vote Added"}else{"Vote Revoked"})
        };
        // meet threashhold
        let _ic : IC.Self = actor("aaaaa-aa");
        let canister_id = Option.unwrap(proposal.canister_id);
        switch(proposal.pType){          
          case (#auth){
            switch(_canisterMap.get(canister_id)){
              case(?canister){
                _canisterMap.put(canister_id, {
                  cid = canister_id;
                  auth = not canister.auth;
                });
                return #ok("AUTH TRIGGER");
              };
              case null {
                return #err("CANISTER NOt FOUND");
              };
            };
          };
          case (#create){
            let settings = {
              freezing_threshold = null;
              controllers = ?[Principal.fromActor(self)];
              memory_allocation = null;
              compute_allocation = null;
            };
            let result = await _ic.create_canister({ settings = ?settings;});
            let cid = result.canister_id;
            _canisterMap.put(cid, { cid; auth = true; });
            _proposeMap.put(id, settleVote(proposal));
            return #ok("CANISTER CREATE" #Principal.toText(cid))   
          };          
          case (#delete) {
            await _ic.delete_canister({ canister_id });
            _proposeMap.put(id, settleVote(proposal));
            return #ok("CANISTER DELETE")   
          };  
          case (#install) {
            await _ic.install_code({
              arg = [];
              wasm_module = Blob.toArray(Option.unwrap(proposal.wasm_code));
              mode = #install;
              canister_id;           
            });
            _proposeMap.put(id, settleVote(proposal));
            return #ok("CANISTER INSTALL")   
          };
          case (#start) {
            await _ic.start_canister({ canister_id });
            _proposeMap.put(id, settleVote(proposal));
            return #ok("CANISTER START")   
          };
          case (#stop) {
            await _ic.stop_canister({ canister_id });
            _proposeMap.put(id, settleVote(proposal));
            return #ok("CANISTER STOP")   
          };                                                   
        };        
      };
      case null{
        return #err("PROPOSAL NOT FOUND")
      };
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