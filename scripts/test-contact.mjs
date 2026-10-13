import assert from 'node:assert/strict';
import {onRequestPost} from '../functions/api/contact.js';
const original=globalThis.fetch;let saved;
const env={TURNSTILE_SECRET_KEY:'test',WAITLIST:{put:async(...args)=>{saved=args;}}};
const data={email:'qa@example.com',message:'A test question about a guide.',category:'question',language:'es',consent:true,token:'test-token'};
const request=(d=data,origin='https://staging.dobermandeals.com')=>new Request('https://staging.dobermandeals.com/api/contact',{method:'POST',headers:{Origin:origin},body:JSON.stringify(d)});
try{
 globalThis.fetch=async()=>Response.json({success:true,hostname:'staging.dobermandeals.com',action:'contact'});
 assert.equal((await onRequestPost({request:request(data,'https://evil.example'),env})).status,403);
 for(const change of [{consent:false},{category:'other'},{message:'short'},{language:'xx'},{email:'invalid'}])assert.equal((await onRequestPost({request:request({...data,...change}),env})).status,400);
 assert.equal((await onRequestPost({request:request(),env})).status,200);
 assert(saved[0].startsWith('staging:contact:'));assert.equal(saved[2].expirationTtl,86400);assert.equal(JSON.parse(saved[1]).language,'es');
 globalThis.fetch=async()=>Response.json({success:true,hostname:'dobermandeals.com',action:'contact'});assert.equal((await onRequestPost({request:request(),env})).status,400);
 globalThis.fetch=async()=>Response.json({success:true,hostname:'staging.dobermandeals.com',action:'waitlist'});assert.equal((await onRequestPost({request:request(),env})).status,400);
 globalThis.fetch=async()=>Response.json({success:true,hostname:'staging.dobermandeals.com',action:'contact'});
 assert.equal((await onRequestPost({request:request(),env:{...env,WAITLIST:{put:async()=>{throw Error('outage');}}}})).status,503);
 console.log('Contact origin, validation, Turnstile hostname/action, storage, TTL and outage checks passed.');
}finally{globalThis.fetch=original;}
