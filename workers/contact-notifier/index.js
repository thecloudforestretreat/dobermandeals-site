export default {
 async fetch(request,env){
  if(request.method!=='POST')return new Response('Method not allowed',{status:405});
  let data;try{data=await request.json();}catch{return new Response('Invalid',{status:400});}
  if(!data||!['question','correction','partnership','subscription'].includes(data.category)||typeof data.message!=='string'||data.message.length>3000||typeof data.email!=='string'||data.email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)||/[\r\n]/.test(data.email))return new Response('Invalid',{status:400});
  const to='dobermandeals3@gmail.com',from='contact-notifications@dobermandeals.com';
  const body=['Doberman Deals contact form',`Environment: ${data.staging?'STAGING TEST':'Production'}`,`Category: ${data.category}`,`Language: ${data.language==='es'?'es':'en'}`,`Reply to: ${data.email}`,'',data.message].join('\n');
  try{await env.CONTACT_EMAIL.send({from:{email:from,name:'Doberman Deals'},to,replyTo:data.email,subject:(data.staging?'[STAGING] ':'')+'Doberman Deals - '+data.category,text:body});return Response.json({ok:true});}catch{return Response.json({ok:false},{status:503});}
 }
};
