import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile, readdir } from 'node:fs/promises';
const config=await readFile('assets/js/site-config.js','utf8');
const head=await readFile('assets/js/head.js','utf8');
function browser(host='dobermandeals.com',pathname='/',noindex=false) {
 const nodes=[],listeners={};
 const document={
  head:{querySelector(selector){return nodes.find(n=>selector.includes('"'+(n.href||n.src)+'"'))||null;},appendChild(n){nodes.push(n);}},
  createElement(type){return {type,setAttribute(k,v){this[k]=v;}};},
  querySelector(){return noindex?{}:null;},
  documentElement:{lang:'en',getAttribute(k){return {'data-pair-id':'DD-001','data-topic-cluster':'commerce','data-template-type':'coming-soon'}[k]||null;}},
  addEventListener(name,handler){listeners[name]=handler;}
 };
 const context=vm.createContext({window:{},document,location:{hostname:host,pathname,href:'https://'+host+pathname,origin:'https://'+host},URL,Date,Object,encodeURIComponent});
 vm.runInContext(config,context);vm.runInContext(head,context);return {context,nodes,listeners};
}
const production=browser();const w=production.context.window;
assert.equal(w.DD_SITE_CONFIG.contact.whatsapp.enabled,false);
assert.equal(w.DDContact.whatsappUrl('en'),null);
assert.ok(Object.isFrozen(w.DD_SITE_CONFIG.contact.whatsapp));
assert.equal(production.nodes.filter(n=>/gtm\.js/.test(n.src||'')).length,1);
const initial=w.dataLayer.length;vm.runInContext(head,production.context);assert.equal(w.dataLayer.length,initial);
assert.equal(w.dataLayer[0].content_language,'en');assert.equal(w.dataLayer[0].language,undefined);
w.DDAnalytics.track('generate_lead',{form_id:'waitlistForm',method:'waitlist',email:'fixture@example.com',token:'not-allowed'});
const event=w.dataLayer.at(-1);assert.equal(event[1],'generate_lead');assert.equal(event[2].pair_id,'DD-001');assert.equal(event[2].email,undefined);assert.equal(event[2].token,undefined);
assert.equal(event[2].content_language,'en');assert.equal(event[2].language,undefined);
w.DDAnalytics.track('directory_outbound',{resource_id:'https://example.com/?email=fixture@example.com'});assert.equal(w.dataLayer.at(-1)[2].resource_id,undefined);
const previous=w.dataLayer.length;w.DDAnalytics.track('unapproved_event',{email:'fixture@example.com'});assert.equal(w.dataLayer.length,previous);
for(const [host,p,noindex] of [['staging.dobermandeals.com','/',false],['abc.dobermandeals-site.pages.dev','/',false],['127.0.0.1','/',false],['dobermandeals.com','/testing/',false],['dobermandeals.com','/missing/',true]]) {
 const b=browser(host,p,noindex);assert.equal(b.nodes.filter(n=>/gtm\.js/.test(n.src||'')).length,0);assert.equal(b.context.window.DDAnalytics,undefined);
}
for(const [phone,enabled,valid] of [['+12025550123',true,true],['2025550123',true,false],['+12025550123',false,false]]) {
 const c=vm.createContext({window:{},Object,encodeURIComponent});
 vm.runInContext(config.replace('enabled: false','enabled: '+enabled).replace('phoneE164: ""','phoneE164: '+JSON.stringify(phone)),c);
 const url=c.window.DDContact.whatsappUrl('es');assert.equal(Boolean(url),valid);if(valid)assert.ok(url.startsWith('https://wa.me/12025550123?text='));
}
async function checkDocuments(dir) {
 for(const entry of await readdir(dir,{withFileTypes:true})) {
  const file=dir+'/'+entry.name;if(entry.isDirectory()){await checkDocuments(file);continue;}if(!file.endsWith('.html'))continue;
  const html=await readFile(file,'utf8');if(!/<head[\s>]/i.test(html))continue;
  assert.equal((html.match(/src="\/assets\/js\/site-config\.js/g)||[]).length,1,file);
  assert.equal((html.match(/src="\/assets\/js\/head\.js/g)||[]).length,1,file);
  assert.ok(html.indexOf('/assets/js/site-config.js')<html.indexOf('/assets/js/head.js'),file);
 }
}
await checkDocuments('dist');
console.log('Central config, WhatsApp URL validation, analytics allowlist, duplicate prevention, staging/noindex isolation and all built HTML script ordering passed.');
