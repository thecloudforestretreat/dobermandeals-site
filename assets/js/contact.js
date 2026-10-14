(function(){
 const form=document.getElementById('contactForm');if(!form)return;
 const es=document.documentElement.lang==='es',status=document.getElementById('contactStatus'),resource=!!form.dataset.messagePrefix,formId=resource?'resourceForm':'contactForm';
 const text=es?{saved_pending:'Tu mensaje está guardado, pero el aviso por correo no se ha entregado. Para asegurar el contacto, escríbenos por correo.',saving:'Guardando tu mensaje…',saved:'Gracias. Tu mensaje se ha guardado.',security:'Completa de nuevo la comprobación de seguridad.',invalid:'Revisa el correo, la categoría, el mensaje y el consentimiento.',unavailable:'No hemos podido guardar tu mensaje. Inténtalo más tarde o escríbenos por correo.',origin:'Envía desde nuestro sitio.'}:{saved_pending:'Your message is saved, but the email notification was not delivered. To ensure contact, please email us directly.',saving:'Saving your message…',saved:'Thanks. Your message has been saved.',security:'Please complete the security check again.',invalid:'Check your email, category, message and consent.',unavailable:'We could not save your message. Try later or email us.',origin:'Please submit from our website.'};
 form.addEventListener('focusin',()=>window.DDAnalytics?.track('contact_start',{form_id:formId}),{once:true});
 form.addEventListener('submit',async event=>{
  event.preventDefault();const button=form.querySelector('button[type=submit]');if(button.disabled)return;
  const fields=new FormData(form);button.disabled=true;form.setAttribute('aria-busy','true');status.textContent=text.saving;
  try{
   const response=await fetch(window.DD_SITE_CONFIG.contact.formEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:fields.get('email'),category:fields.get('category'),message:(form.dataset.messagePrefix||'')+fields.get('message'),consent:fields.get('consent')==='on',token:fields.get('cf-turnstile-response'),language:es?'es':'en'})});
   const result=await response.json();status.textContent=text[result.code]||text.unavailable;
   if(response.ok&&result.ok){form.reset();window.DDAnalytics?.track('generate_lead',{form_id:formId,method:'contact',lead_type:resource?'resource':'contact'});}else window.DDAnalytics?.track('form_error',{form_id:formId,error_category:'server_rejected'});
  }catch{status.textContent=text.unavailable;window.DDAnalytics?.track('form_error',{form_id:formId,error_category:'network_error'});}
  finally{button.disabled=false;form.removeAttribute('aria-busy');window.turnstile?.reset();}
 });
})();
