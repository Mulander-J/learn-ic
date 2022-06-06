#!/bin/bash

# Local Deploy
_cmdHead="dfx canister call MWCM"
# _cmdHead="dfx canister --network=ic --wallet=yz336-daaaa-aaaal-qag3a-cai call e5x6l-faaaa-aaaal-qa36q-cai"
# _cmdHead="dfx canister --network=ic call e5x6l-faaaa-aaaal-qa36q-cai"
echo "===>RUN WAY="$1
if [ $1 == "deploy" ]
then
  echo "===>Deploy"
  echo "===>Deployer Principal:" $(dfx identity get-principal)
  dfx deploy --argument='(vec {principal "'$(dfx identity get-principal)'";}, 2)'
  # dfx deploy --network=ic --argument='(vec {principal "'$(dfx identity get-principal)'";}, 2)'
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
  # $_cmdHead propose '(variant {join}, opt principal "cnh44-cjhoh-yyoqz-tcp2t-yto7n-6vlpk-xw52p-zuo43-rrlge-4ozr5-6ae", null)'
  # $_cmdHead propose '(variant {auth}, opt principal "r7inp-6aaaa-aaaaa-aaabq-cai", null)'
  # $_cmdHead propose '(variant {auth}, opt principal "dyhvq-iaaaa-aaaal-qa4ta-cai", null)'
  # echo "===>Fetch proposes"
  # $_cmdHead proposes
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