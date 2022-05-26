#!/bin/bash

# Local Deploy
_name="MWCM"

# echo "===>Deployer Principal:" $(dfx identity get-principal)

echo "===>Deploy"
dfx deploy --argument='(vec {principal "cnh44-cjhoh-yyoqz-tcp2t-yto7n-6vlpk-xw52p-zuo43-rrlge-4ozr5-6ae"; principal "ndb4h-h6tuq-2iudh-j3opo-trbbe-vljdk-7bxgi-t5eyp-744ga-6eqv6-2ae"; principal "lzf3n-nlh22-cyptu-56v52-klerd-chdxu-t62na-viscs-oqr2d-kyl44-rqe"}, 2)'

# echo "===>Fetch Groups"
# dfx canister call $_name groups
# echo "===>Fetch passNum"
# dfx canister call $_name passNum
# echo "===>Fetch proposes"
# dfx canister call $_name proposes

# echo "===>Add proposal"
# dfx canister call $_name propose '(variant {create}, null, null)'
# echo "===>Fetch proposes"
# dfx canister call $_name proposes

# echo "===>Vote Yes"
# dfx canister call $_name vote '("1", true)'
# dfx canister call $_name proposes
echo "===>Vote No"
dfx canister call $_name vote '("1", false)'
dfx canister call $_name proposes