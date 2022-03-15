export const idlFactory = ({ IDL }) => {
  const UserInfo = IDL.Record({ 'name' : IDL.Text });
  const Author = IDL.Record({ 'id' : IDL.Principal, 'user' : UserInfo });
  const Result = IDL.Variant({ 'ok' : IDL.Bool, 'err' : IDL.Text });
  const Time = IDL.Int;
  const Message = IDL.Record({ 'content' : IDL.Text, 'time' : Time });
  const MessageWithAuthor = IDL.Record({
    'content' : IDL.Text,
    'time' : Time,
    'author' : Author,
  });
  return IDL.Service({
    'authorMatch' : IDL.Func([IDL.Vec(IDL.Principal)], [IDL.Vec(Author)], []),
    'emptyData' : IDL.Func([], [IDL.Int], []),
    'follow' : IDL.Func([IDL.Principal], [Result], []),
    'followBy' : IDL.Func([IDL.Principal], [Result], []),
    'followBys' : IDL.Func([], [IDL.Vec(Author)], []),
    'follows' : IDL.Func([], [IDL.Vec(Author)], []),
    'getName' : IDL.Func([], [IDL.Text], ['query']),
    'getRemoteName' : IDL.Func([IDL.Principal], [IDL.Text], []),
    'getRemotePosts' : IDL.Func([IDL.Principal, Time], [IDL.Vec(Message)], []),
    'getRemotePostsWithAuthor' : IDL.Func(
        [IDL.Principal, Time],
        [IDL.Vec(MessageWithAuthor)],
        [],
      ),
    'post' : IDL.Func([IDL.Text], [Result], []),
    'posts' : IDL.Func([Time], [IDL.Vec(MessageWithAuthor)], []),
    'setUser' : IDL.Func([UserInfo], [UserInfo], []),
    'timeline' : IDL.Func([Time], [IDL.Vec(MessageWithAuthor)], []),
  });
};
export const init = ({ IDL }) => { return []; };
