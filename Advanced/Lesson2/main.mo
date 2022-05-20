import Principal "mo:base/Principal";
import Array "mo:base/Array";
import IC "./ic";

actor class(_mem:[Text]) = self {
  let _ic : IC.Self = actor("aaaaa-aa");

  let _members = Array.map<Text>(_mem, func(m){Principal.fromText(m);});

  let _controllers = Array.append<Principal>(_members, [Principal.fromActor(self)]);

  public func create_canister () :async IC.canister_id {
    let settings = {
      freezing_threshold = null;
      controllers = ?_controllers;
      memory_allocation = null;
      compute_allocation = null;
    };
    let result = await _ic.create_canister({ settings = ?settings;});
    result.canister_id;
  };

  public func install_code (
    _arg : [Nat8],
    _wasm_module : IC.wasm_module,
    _mode : { #reinstall; #upgrade; #install },
    _canister_id : IC.canister_id
  ) {
    await _ic.install_code({
      arg = _arg;
      wasm_module = _wasm_module;
      mode = _mode;
      canister_id = _canister_id;
    });
  };

  public func start_canister (_canister_id : IC.canister_id) {
    await _ic.start_canister({ canister_id = _canister_id });
  };

  public func stop_canister (_canister_id : IC.canister_id) {
    await _ic.stop_canister({ canister_id = _canister_id });
  };

  public func delete_canister (_canister_id : IC.canister_id) {
    await _ic.delete_canister({ canister_id = _canister_id });
  };
};