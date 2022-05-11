// Persistent logger keeping track of what is going on.

import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Deque "mo:base/Deque";
import List "mo:base/List";
import Nat "mo:base/Nat";
import Option "mo:base/Option";

import Logger "mo:ic-logger/Logger";

shared(msg) actor class TextLogger() {

  type TxtLog = Logger.State<Text>;

  let OWNER = msg.caller;
  
  let LIMIT_SIZE = 3;

  stable var state : TxtLog = Logger.new<Text>(0, ?LIMIT_SIZE);  
  stable var states : [TxtLog] = [state];
  var logger = Logger.Logger<Text>(state);

  // Principals that are allowed to log messages.
  stable var allowed : [Principal] = [OWNER];

  // Set allowed principals.
  public shared (msg) func allow(ids: [Principal]) {
    assert(msg.caller == OWNER);
    allowed := ids;
  };

  // Add a set of messages to the log.
  public shared (msg) func append(msgs: [Text]) {
    assert(Option.isSome(Array.find(allowed, func (id: Principal) : Bool { msg.caller == id })));
    
    let curSize = logger.stats().bucket_sizes[0];
    assert(curSize <= LIMIT_SIZE);
    if(curSize == LIMIT_SIZE){
        state := Logger.new<Text>(0, ?LIMIT_SIZE);
        states := Array.append<TxtLog>(states, [state]);
        logger := Logger.Logger<Text>(state);
    };

    logger.append(msgs);
  };

  // Return log stats, where:
  //   start_index is the first index of log message.
  //   bucket_sizes is the size of all buckets, from oldest to newest.
  public query func stats() : async Logger.Stats {
    logger.stats()
  };

  // Return the messages between from and to indice (inclusive).
  public shared query (msg) func view(from: Nat, to: Nat) : async Logger.View<Text> {
    assert(msg.caller == OWNER);
    logger.view(from, to)
  };

  // Drop past buckets (oldest first).
  public shared (msg) func pop_buckets(num: Nat) {
    assert(msg.caller == OWNER);
    logger.pop_buckets(num)
  };

  public query func sizes() : async Int {
    states.size();
  };
}