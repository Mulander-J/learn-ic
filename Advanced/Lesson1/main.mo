import Array "mo:base/Array";
import Logger "mo:ic-logger/Logger";
import TLog "modules/TextLogger";

actor DaddyLogger {
  let Max = 3;  
  var logNext = 0;
  let loggers : [var ?TLog.TextLogger] = Array.init(1, null);

  public shared query func getNext() : async Nat{
    logNext;
  };

  // dynamically install a new TextLogger    
  private func newLog() : async TLog.TextLogger {
    let tl = await TLog.TextLogger();
    logNext += 1;
    loggers[logNext] := ?tl;
    tl;
  };

  // Add a set of messages to the log.
  public func append(msgs: [Text]) {
    let _logger = switch (loggers[logNext]) {
      case null { 
        await newLog(); 
      };
      case (?log) {
        let stats = await log.stats();
        let tol = Array.foldLeft<Nat, Nat>(stats.bucket_sizes, 0, func (b, a) { return b+a; });
        assert(tol <= Max);
        
        if(tol == Max){
          await newLog();
        }else{
          log;
        };
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

    var start_index =  0;
    var messages: [Text] = [];
    
    if(start <= logNext){
      label LOOP loop{
        if (start <= end) { 
          let _to = if(start < end){
            Max;
          }else{
            end % Max;
          };
          try{
            switch(loggers[start]){
              case null {};
              case (?log){
                let _temp = await log.view(_fr, _to);
                messages := Array.append<Text>(messages,_temp.messages);
                if(start_index == 0){
                  start_index := _temp.start_index;
                };
              };
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
      start_index = start_index;
      messages = messages;
    };
  };
};
