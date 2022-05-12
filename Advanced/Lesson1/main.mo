import Array "mo:base/Array";
import Buffer "mo:base/Buffer";

import Logger "mo:ic-logger/Logger";

import TLog "modules/TextLogger";

actor DaddyLogger {
  let Max = 3;  
  var logNext = 0;
  let loggers = Buffer.Buffer<TLog.TextLogger>(1);

  public shared query func getNext() : async Int{
    logNext;
  };

  // dynamically install a new TextLogger    
  private func newLog() : async TLog.TextLogger {
    let tl = await TLog.TextLogger();
    loggers.add(tl);
    tl;
  };

  // Add a set of messages to the log.
  public func append(msgs: [Text]) {
    let _logger = switch (loggers.getOpt(logNext)) {
      case (?log) {
        let stats = await log.stats();
        let tol = Array.foldLeft<Nat, Nat>(stats.bucket_sizes, 0, func (b, a) { return b+a; });
        
        assert(tol <= Max);
        
        if(tol == Max){
          logNext += 1;
          await newLog();
        }else{
          log;
        };
      };
      case Null { 
        await newLog(); 
      };
    };

    _logger.append(msgs);
  };

  // Return the messages between from and to indice (inclusive).
  public shared func view(from: Nat, to: Nat) : async Logger.View<Text> {
    assert(from <= to);

    let end = to / Max;
    var start = from / Max;
    var _fr = from % Max;

    var messages: [Text] = [];
    
    if(start <= logNext){
      label LOOP loop{
        if (start <= end) { 
          let _to = if(start < end){
            Max;
          }else{
            to % Max;
          };
          try{
            switch(loggers.getOpt(start)){
              case (?log){
                let _temp = await log.view(_fr, _to);
                messages := Array.append<Text>(messages,_temp.messages);
              };
              case Null {};
            };
          }
          catch(err){};

          _fr := 0;
          start += 1;
        }else{
          break LOOP;
        };
      };
    };

    return {
      start_index = from;
      messages = messages;
    };
  };
};
