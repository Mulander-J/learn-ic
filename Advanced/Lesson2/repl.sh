#!/usr/bin/ic-repl

// assume we already installed the greet canister

// change to id1
// identity default "./resources/identity/id1.pem";

// import the default canister, need: dfx start --clean
import canister = "rrkah-fqaaa-aaaaa-aaaaq-cai";

// setup three Principals, multi-sig model is 2 / 3 
// call canister.init(vec {principal "cnh44-cjhoh-yyoqz-tcp2t-yto7n-6vlpk-xw52p-zuo43-rrlge-4ozr5-6ae"; principal "ndb4h-h6tuq-2iudh-j3opo-trbbe-vljdk-7bxgi-t5eyp-744ga-6eqv6-2ae"; principal "lzf3n-nlh22-cyptu-56v52-klerd-chdxu-t62na-viscs-oqr2d-kyl44-rqe"}, 2);

//---------------CREATE CANISTER---------------//

// propose to create a canister by id1
// call canister.propose(variant {create}, null, null);
// let proposal_id1 = _.id;

// vote the above proposal by id1
// call canister.vote(proposal_id1, true);

// change to id2
// identity default "./resources/identity/id2.pem";

// vote this proposal by id2, and execute the creating canister
// call canister.vote(proposal_id1, true);

// let canister_id = _.canister_id?;

//---------------INSTALL CODE---------------//

// change to id1
// identity default "./resources/identity/id1.pem";
// propose to install code into above canister by id1
// let canister_id = principal "r7inp-6aaaa-aaaaa-aaabq-cai";
// call canister.propose(variant {install}, opt canister_id, opt file "./resources/sample/sample.wasm");
// let proposal_id2 = _.ok;

call canister.test(file "./resources/sample/sample.wasm");
_;

// vote the above proposal by id1
// call canister.vote(proposal_id2, true);

// change to id2
// identity default "./resources/identity/id2.pem";

// vote the above proposal by id2, and execute the installing code
// call canister.vote(proposal_id2, true);

//---------------START CANISTER---------------//

// change to id1
// identity default "./resources/identity/id1.pem";

// propose to start the canister by id1
// call canister.propose(variant {start}, opt canister_id, null);
// let proposal_id3 = _;

// vote the above proposal by id1
// call canister.vote(proposal_id3, true);

// change to id2
// identity default "./resources/identity/id2.pem";

// vote the above proposal by id2, and execute the starting canister
// call canister.vote(proposal_id3, true);

//---------------CALL CANISTER---------------//

// call the installed canister
// call canister_id.greet("world");

// assert _ == "This is Sample for install.";