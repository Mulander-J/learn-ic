import type { Principal } from '@dfinity/principal';
export interface Author { 'id' : Principal, 'user' : UserInfo }
export type List = [] | [[Principal, List]];
export interface Message { 'text' : string, 'time' : Time }
export interface MessageWithAuthor {
  'text' : string,
  'time' : Time,
  'author' : Author,
}
export type Result = { 'ok' : boolean } |
  { 'err' : string };
export type Time = bigint;
export interface UserInfo { 'name' : string }
export interface _SERVICE {
  'authorMatch' : (arg_0: List) => Promise<Array<Author>>,
  'emptyData' : () => Promise<bigint>,
  'follow' : (arg_0: Principal) => Promise<Result>,
  'followBy' : (arg_0: Principal) => Promise<Result>,
  'followBys' : () => Promise<Array<Author>>,
  'follows' : () => Promise<Array<Author>>,
  'getRemoteName' : (arg_0: Principal) => Promise<string>,
  'getRemotePosts' : (arg_0: Principal, arg_1: Time) => Promise<Array<Message>>,
  'getRemotePostsWithAuthor' : (arg_0: Principal, arg_1: Time) => Promise<
      Array<MessageWithAuthor>
    >,
  'get_name' : () => Promise<string>,
  'post' : (arg_0: string, arg_1: string) => Promise<Result>,
  'posts' : (arg_0: Time) => Promise<Array<MessageWithAuthor>>,
  'setUser' : (arg_0: UserInfo) => Promise<UserInfo>,
  'timeline' : (arg_0: Time) => Promise<Array<MessageWithAuthor>>,
}
