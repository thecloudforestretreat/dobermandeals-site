import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const code=fs.readFileSync(new URL('../assets/js/contact.js',import.meta.url),'utf8');
for(const [lang,prefix] of [['en','Resource suggestion — '],['es','Sugerencia de recurso — '],['en','']]){
 const events=[],handlers={},status={},button={disabled:false};let posted,reset=false,securityReset=false;
 const form={dataset:{messagePrefix:prefix},addEventListener:(name,fn)=>handlers[name]=fn,querySelector:()=>button,setAttribute(){},removeAttribute(){},reset(){reset=true;}};
 const values={email:'test@example.invalid',category:'question',message:'x'.repeat(2900),consent:'on','cf-turnstile-response':'test-token'};
 const window={DD_SITE_CONFIG:{contact:{formEndpoint:'/api/contact'}},DDAnalytics:{track:(name,data)=>events.push({name,data})},turnstile:{reset(){securityReset=true;}}};
 vm.runInNewContext(code,{window,document:{documentElement:{lang},getElementById:id=>id==='contactForm'?form:status},FormData:class{get(name){return values[name];}},fetch:async(url,options)=>{assert.equal(url,'/api/contact');posted=JSON.parse(options.body);return {ok:true,json:async()=>({ok:true,code:'saved'})};}});
 handlers.focusin();await handlers.submit({preventDefault(){}});
 assert.equal(posted.message,prefix+values.message);assert(posted.message.length<=3000);assert.equal(posted.category,'question');assert.equal(posted.language,lang);assert.equal(posted.consent,true);assert(reset&&securityReset&&!button.disabled);
 const lead=events.find(e=>e.name==='generate_lead');assert.equal(lead.data.form_id,prefix?'resourceForm':'contactForm');assert.equal(lead.data.lead_type,prefix?'resource':'contact');
 assert(!JSON.stringify(events).includes(values.email));assert(!JSON.stringify(events).includes(values.message));
}
for(const path of ['community/submit-a-resource/index.html','es/comunidad/enviar-recurso/index.html']){
 const html=fs.readFileSync(new URL('../'+path,import.meta.url),'utf8');assert(html.includes('name="category" value="question"'));assert(html.includes('data-action="contact"'));assert(html.includes('maxlength="2900"'));assert(html.includes('/assets/js/contact.js?v=contact3'));assert(html.includes('data-message-prefix='));
}
console.log('Resource and ordinary contact submission payloads, bounded prefixes, localized status, static analytics identifiers and no message/email analytics passed (mock delivery only).');
