"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const { _answer: answer }=require("../api/assistant.js");
const policyEndpoint=require("../api/agent.js");

test("document questions never certify entry paperwork",()=>{
 const r=answer("What documents does my dog need?");
 assert.equal(r.mode,"guided-policy-preview");
 assert.match(r.answer,/cannot verify your paperwork/i);
});
test("reviewed airline responses remain preliminary",()=>{
 const r=answer("Can I fly with Air France?");
 assert.match(r.answer,/not a live availability check/i);
 assert.ok(r.reviewed_on);
});
test("unreviewed airline remains unverified",()=>{
 const r=answer("What about Aer Lingus?");
 assert.match(r.answer,/not been independently reviewed/i);
});
test("booking is not promised",()=>{
 const r=answer("Book a ticket for my dog");
 assert.match(r.answer,/cannot currently/i);
});
test("generic guided answers disclose that no LLM is active",()=>{
 const r=answer("Hello!");
 assert.match(r.answer,/not yet a generative AI chat/i);
});
const res=()=>{
 let s=200;
 return {setHeader(){return this;},status(v){s=v;return this;},json(v){this.body=v;this.code=s;return this;}};
};
test("website policy API screens reviewed airlines",async()=>{
 const reply=res();
 await policyEndpoint({method:"POST",headers:{},body:{action:"screen",airline:"Air France",petWeightKg:6,carrierWeightKg:1.5}},reply);
 assert.equal(reply.code,200);
 assert.equal(reply.body.status,"preliminary-weight-match");
});
test("policy API rejects GET and unknown actions",async()=>{
 let reply=res();
 await policyEndpoint({method:"GET",headers:{}},reply);
 assert.equal(reply.code,405);
 reply=res();
 await policyEndpoint({method:"POST",headers:{},body:{action:"book-flight"}},reply);
 assert.equal(reply.code,400);
});
