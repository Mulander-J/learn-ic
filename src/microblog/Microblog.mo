import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import List "mo:base/List";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor Microblog{

  /*  global type  */

  public type UserInfo = {
    name: Text;
  };

  public type Author = {    
    id: Principal;
    user: UserInfo; 
  };

  public type Message = {
    text: Text;
    time: Time.Time;
  };

  public type MessageWithAuthor = {
    text: Text;
    time: Time.Time;
    author: Author;
  };

  public type InterfaceMicroblog = actor {
    get_name: shared query () -> async Text;
    posts: shared (Time.Time) -> async [MessageWithAuthor];
    followBy: shared (Principal) -> async Result.Result<Bool, Text>;
  };

  /*  stable var  */

  let defaultAuthor : Text = "Anonymous";

  stable var _user : UserInfo = {
    name = ""; 
  };
  stable var _following : List.List<Principal> = List.nil();
  stable var _followedBy : List.List<Principal> = List.nil();
  stable var _messages : List.List<Message> = List.nil();  

  /*  assert hooks  */

  private func onlyOwner(caller: Principal) {    
    assert(Principal.toText(caller) == "zr3dc-zgodc-lppau-anuof-ak27e-kln7s-5ssyc-3veyv-km2ix-cwcgy-pae");
  };

  /*  utils  */

  public shared func getRemoteName(pid: Principal) : async Text {
    try{
      let canister : InterfaceMicroblog = actor(Principal.toText(pid));
      let name = await canister.get_name();

      if(Text.size(name) > 0){
        return name;
      }else {
        return defaultAuthor;
      }
    }catch(err){
      return defaultAuthor;
    };
  };

  public shared func authorMatch(pids: List.List<Principal>): async [Author] {
    var _res : List.List<Author> = List.nil();

    for(pid in Iter.fromList(pids)){
      _res := List.push<Author>({
        id = pid;
        user = {
          name = await getRemoteName(pid);
        };
      } ,_res);
    };

    List.toArray(_res);
  };

  public shared func getRemotePosts(pid: Principal, sience: Time.Time) : async [Message] {
    try{
      let canister : InterfaceMicroblog = actor(Principal.toText(pid));
      await canister.posts(sience);
    }catch(err){
      return [];
    };
  };

  public shared func getRemotePostsWithAuthor(pid: Principal, sience: Time.Time) : async [MessageWithAuthor] {
    let _name = await getRemoteName(pid);
    let _msgs = await getRemotePosts(pid, sience);

    Array.map<Message, MessageWithAuthor>(_msgs, func (e){
      return {
        text = e.text;
        time = e.time;
        author = {
          id = pid;
          user = {
            name = _name;
          };
        };
      }
    });
  };

  /*  query methods  */

  public shared query func get_name() : async Text {
    if(Text.size(_user.name) > 0){      
      _user.name;
    }else{
      defaultAuthor;
    };
  };

  public shared func follows() : async [Author] {
    await authorMatch(_following);
  };
  public shared func followBys() : async [Author] {
    await authorMatch(_followedBy);
  };

  public shared query func posts(sience: Time.Time) : async [MessageWithAuthor] {
    var list: List.List<Message> = List.nil();

    switch (sience) {
      case (0) {
        list := _messages;
      };
      case (time) { 
        list := List.filter<Message>(_messages, func(e){e.time >= time});
      };
    };

    let _name = _user.name;

    List.toArray(List.map<Message, MessageWithAuthor>(list, func (e){
      return {
        text = e.text;
        time = e.time;
        author = {
          id = Principal.fromActor(Microblog);
          user = {
            name = _name;
          };
        };
      };
    }));
  };

  public shared func timeline(sience: Time.Time) : async [MessageWithAuthor] {
    var _all : List.List<MessageWithAuthor> = List.nil();

    for(pid in Iter.fromList(_following)) {
      let _msgs: [Message] = await getRemotePosts(pid, sience);
      let _name: Text = await getRemoteName(pid);      

      if(_msgs.size() > 0){
        for(_m in Iter.fromArray(_msgs)){
          if(sience <= _m.time){
              _all := List.push<MessageWithAuthor>({
                text = _m.text;
                time = _m.time;
                author = {
                  id = pid;
                  user = {
                    name = _name;
                  };
                };
              }, _all);
          };
        };
      };
    };

    List.toArray(_all);
  };

  /*  update methods  */

  public shared(msg) func setUser(user: UserInfo) : async UserInfo {
    onlyOwner(msg.caller);

    _user := {
      name = user.name;
    };

    _user;
  };

  public shared(msg) func post(message: Text, secret: Text) : async Result.Result<Bool, Text> {
    // onlyOwner(msg.caller);
    if(secret == "90876"){
      if(Text.size(message) <= 0){
        return #err("Empty Message");
      };

      _messages := List.push<Message>({
        text = message;
        time = Time.now();
      }, _messages);

      return #ok(true)
    }else{
      return #err("You are not owner")
    }
  };

  public shared(msg) func emptyData() : async Int {
    onlyOwner(msg.caller);

    _following :=  List.nil();
    _followedBy :=  List.nil();
    _messages := List.nil();

    List.size(_following) + List.size(_followedBy) + List.size(_messages)
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
}
