import TLog "./modules/TextLogger";
import Logger "mo:ic-logger/Logger";

actor DaddyLogger {
  let Max = 3;  
  var logNext = -1;
  let loggers : [var ?TLog] = Array.init(n, null);

  // dynamically install a new TextLogger    
  private func newLog() : async TLog {
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
        let size = await log.stats().bucket_sizes;
        
        assert(size <= Max);
        
        if(size == Max){
          await newLog();
        }else{
          log;
        };
      };
    };

    await _logger.append(msgs);
  };

  // Return the messages between from and to indice (inclusive).
  public shared query func view(from: Nat, to: Nat) : async Logger.View<Text> {
    assert(from <= to);

    let end = to / Max;
    var start = from / Max;
    var _fr = from % Max;

    var start_index =  0;
    var messages = [];
    
    if(start <= logNext){
      label Loop loop{
        if (start <= end) { 
          let _to = if(start < end){
            Max;
          }else{
            end % Max - 1;
          };
          try{
            let _temp = await loggers[start].view(_fr, _to);
            messages := Array.append(messages,_temp.messages);
            if(start_index == 0){
              start_index := _temp.start_index;
            };
          }catch{};

          _fr := 0;
          start++;
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
}
