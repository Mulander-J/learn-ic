import Iter "mo:base/Iter";
import List "mo:base/List";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor Microblog{
  
  /*  global type  */

  public type Message = {
    content: Text;
    time: Time.Time;
  };

  public type InterfaceMicroblog = actor {
    posts: shared (Time.Time) -> async [Message];
    follows: shared () -> async [Principal];
    followBys: shared () -> async [Principal];
    followBy: shared (Principal) -> async Result.Result<Bool, Text>;
  };

  /*  stable var  */

  stable var _following : List.List<Principal> = List.nil();
  stable var _followedBy : List.List<Principal> = List.nil();
  stable var _messages : List.List<Message> = List.nil();

  /*  assert hooks  */
  private func onlyOwner(caller: Principal) {    
    assert(Principal.toText(caller) == "zr3dc-zgodc-lppau-anuof-ak27e-kln7s-5ssyc-3veyv-km2ix-cwcgy-pae");
  };

  /*  query methods  */

  public shared query func follows() : async [Principal] {
    List.toArray(_following);
  };
  public shared query func followBys() : async [Principal] {
    List.toArray(_followedBy);
  };

  public shared query func posts(sience: Time.Time) : async [Message] {
    switch (sience) {
      case (0) { 
        List.toArray(_messages);
      };
      case (time) { 
        let _filter = List.filter<Message>(_messages, func(e){e.time >= time});
        List.toArray(_filter);
      };
    }
  };

  public shared func timeline(sience: Time.Time) : async [Message] {
    var _all : List.List<Message> = List.nil();

    for(pid in Iter.fromList(_following)) {
      let canister : InterfaceMicroblog = actor(Principal.toText(pid));
      var _msgs = await canister.posts(sience);

      for(_m in Iter.fromArray(_msgs)){
        switch (sience) {
          case (0) { 
            _all := List.push<Message>(_m, _all);
          };
          case (time) { 
            if(time <= _m.time){
               _all := List.push<Message>(_m, _all);
            };
          };
        };
      };
    };

    List.toArray(_all);
  };

  /*  update methods  */

  public shared(msg) func follow(pid: Principal) : async Result.Result<Bool, Text> {
    onlyOwner(msg.caller);

    let isExist = List.some<Principal>(_following, func(e){Principal.equal(e,pid)});

    if( isExist == false) {
      _following := List.push<Principal>(pid, _following);
    };

    try
    {
      let canister : InterfaceMicroblog = actor(Principal.toText(pid));
      await canister.followBy(Principal.fromActor(Microblog));
    }
    catch(e)
    {
      return #ok(false);
    }    
  };

  public shared func followBy(pid: Principal) : async Result.Result<Bool, Text> {
    let isExist = List.some<Principal>(_followedBy, func(e){Principal.equal(e,pid)});

    if( isExist == false) {
      _followedBy := List.push<Principal>(pid, _followedBy);
      return #ok(true);
    }else{
      return #ok(false);
    };
  };

  public shared(msg) func post(message: Text) : async Result.Result<Bool, Text> {
    onlyOwner(msg.caller);

    if(Text.size(message) <= 0){
      return #err("Empty Message");
    };

    let _m : Message = {
      content = message;
      time = Time.now();
    };

    _messages := List.push<Message>(_m, _messages);

    return #ok(true)
  };
}
