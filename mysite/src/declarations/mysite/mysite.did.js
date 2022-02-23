export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'fibonaci' : IDL.Func([IDL.Nat], [IDL.Nat], []),
    'greet' : IDL.Func([IDL.Text], [IDL.Text], []),
    'quickSort' : IDL.Func([IDL.Vec(IDL.Int)], [IDL.Vec(IDL.Int)], []),
  });
};
export const init = ({ IDL }) => { return []; };
