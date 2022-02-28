import Text "mo:base/Text";
import Nat "mo:base/Nat";
// Create a simple Counter actor.
actor Counter {
  /*===Counter-Code-Start===*/
  stable var cur : Nat = 0;

  // Increment the counter with the increment function.
  public func inc() : async () {
    cur += 1;
  };

  // Read the counter value with a get function.
  public query func get() : async Nat {
    cur;
  };

  // Write an arbitrary value with a set function.
  public func set(n: Nat) : async () {
    cur := n;
  };
  /*===Counter-Code-End===*/

  /*===HttpReq-Code-Start===*/
  public type ChunkId = Nat;
  public type HeaderField = (Text, Text);
  public type HttpRequest = {
    url : Text;
    method : Text;
    body : [Nat8];
    headers : [HeaderField];
  };
  public type HttpResponse = {
    // body : [Nat8];
    body: Blob;
    headers : [HeaderField];
    streaming_strategy : ?StreamingStrategy;
    status_code : Nat16;
  };
  public type Key = Text;
  public type SetAssetContentArguments = {
    key : Key;
    sha256 : ?[Nat8];
    chunk_ids : [ChunkId];
    content_encoding : Text;
  };
  public type StreamingCallbackHttpResponse = {
    token : ?StreamingCallbackToken;
    body : [Nat8];
  };
  public type StreamingCallbackToken = {
    key : Key;
    sha256 : ?[Nat8];
    index : Nat;
    content_encoding : Text;
  };
  public type StreamingStrategy = {
    #Callback : {
      token : StreamingCallbackToken;
      callback : shared query StreamingCallbackToken -> async ?StreamingCallbackHttpResponse;
    };
  };

  // http_request : shared query HttpRequest -> async HttpResponse;
  public shared query func http_request(request: HttpRequest) : async HttpResponse {
    {
      body = Text.encodeUtf8(
        "<html><body><h1>Hello Conuter</h1><h2>CurrentVal:"
        #Nat.toText(cur)#
        "</h2></bdoy></html>"
      );
      headers = [];
      streaming_strategy = null;
      status_code = 200;
    };
  };
  /*===HttpReq-Code-End===*/
}
