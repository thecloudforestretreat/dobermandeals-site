const HOSTS=new Set(['dobermandeals.com','www.dobermandeals.com','staging.dobermandeals.com']);
const categories=new Set(['question','correction','partnership','subscription']);
const reply=(status,code)=>Response.json({ok:status===200,code},{status,headers:{'Cache-Control':'no-store'}});
export async function onRequestPost({request,env}){
 const url=new URL(request.url);
 if(!HOSTS.has(url.hostname)||request.headers.get('Origin')!==url.origin)return reply(403,'origin');
 if(!env.TURNSTILE_SECRET_KEY||!env.WAITLIST)return reply(503,'unavailable');
 let data;
 try{const raw=await request.text();if(raw.length>8192)return reply(413,'invalid');data=JSON.parse(raw);}catch{return reply(400,'invalid');}
 if(!data||typeof data!=='object'||Array.isArray(data))return reply(400,'invalid');
 const email=typeof data.email==='string'?data.email.trim().toLowerCase():'';
 const message=typeof data.message==='string'?data.message.trim():'';
 if(email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||message.length<10||message.length>3000||!categories.has(data.category)||!['en','es'].includes(data.language)||data.consent!==true)return reply(400,'invalid');
 if(typeof data.token!=='string'||!data.token||data.token.length>2048)return reply(400,'security');
 try{
  const response=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:new URLSearchParams({secret:env.TURNSTILE_SECRET_KEY,response:data.token}),signal:AbortSignal.timeout(10000)});
  if(!response.ok)return reply(503,'unavailable');
  const verified=await response.json();
  if(!verified.success||verified.hostname!==url.hostname||verified.action!=='contact')return reply(400,'security');
  const stage=url.hostname==='staging.dobermandeals.com';
  await env.WAITLIST.put((stage?'staging:contact:':'contact:')+crypto.randomUUID(),JSON.stringify({email,message,category:data.category,language:data.language,consent:true,submittedAt:new Date().toISOString()}),{expirationTtl:stage?86400:2592000});
  return reply(200,'saved');
 }catch{return reply(503,'unavailable');}
}
export function onRequestGet(){return reply(405,'method');}
