#!/bin/bash

# Local Deploy
_cmdHead="dfx canister call MWCM"

echo "===>RUN WAY="$1

if [ $1 == "deploy" ]
then
  echo "===>Deploy"
  echo "===>Deployer Principal:" $(dfx identity get-principal)
  dfx deploy --argument='(vec {principal "cnh44-cjhoh-yyoqz-tcp2t-yto7n-6vlpk-xw52p-zuo43-rrlge-4ozr5-6ae"; principal "ndb4h-h6tuq-2iudh-j3opo-trbbe-vljdk-7bxgi-t5eyp-744ga-6eqv6-2ae"; principal "lzf3n-nlh22-cyptu-56v52-klerd-chdxu-t62na-viscs-oqr2d-kyl44-rqe"}, 2)'
elif [ $1 == "fetch" ]
then
  echo "===>Fetch Groups"
  $_cmdHead groups
  echo "===>Fetch passNum"
  $_cmdHead passNum
  echo "===>Fetch proposes"
  $_cmdHead proposes
  echo "===>Fetch canisters"
  $_cmdHead canisters
elif [ $1 == "propose" ]
then
  echo "===>Add proposal"
  $_cmdHead propose '(variant {create}, null, null)'
  echo "===>Fetch proposes"
  $_cmdHead proposes
elif [ $1 == "vote" ]
then
  if [ $3 == 0 ]
  then
    echo "===>Vote No"
    $_cmdHead vote '("'$2'", false)'
    $_cmdHead proposes
  else
    echo "===>Vote Yes"
    $_cmdHead vote '("'$2'", true)'
    $_cmdHead proposes
  fi
else
   echo "NOTHING HAPPEN"
fi