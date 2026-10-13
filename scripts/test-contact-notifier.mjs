import assert from 'node:assert/strict';
import worker from '../workers/contact-notifier/index.js';
let sent;const env={CONTACT_EMAIL:{send:async data=>{sent=data;}}};
const post=data=>new Request('https://private-service/',{method:'POST',body:JSON.stringify(data)});
const data={email:'qa@example.com',category:'question',message:'Prueba de contacto: ¿pueden ayudar?',language:'es',staging:true};
assert.equal((await worker.fetch(post(data),env)).status,200);assert.equal(sent.to,'dobermandeals3@gmail.com');assert.equal(sent.replyTo,'qa@example.com');assert(sent.text.includes(data.message));assert(sent.subject.startsWith('[STAGING]'));
assert.equal((await worker.fetch(post({...data,email:'bad\r\nBcc: victim@example.com'}),env)).status,400);
assert.equal((await worker.fetch(post(data),{CONTACT_EMAIL:{send:async()=>{throw Error();}}})).status,503);
console.log('Private notifier recipient restriction, reply address, Unicode content, header injection rejection and delivery-failure tests passed.');
