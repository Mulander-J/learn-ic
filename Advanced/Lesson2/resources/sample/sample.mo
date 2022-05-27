import Cycles "mo:base/ExperimentalCycles";
actor {
  public shared query func greet() : async Text{
    "This is Sample for install.";
  };
  public query func getCycles() : async Nat {
    Cycles.balance();
  };
};