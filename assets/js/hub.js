(function(){
 const toggle=document.querySelector('[data-menu-toggle]'),nav=document.querySelector('#hub-navigation');
 if(toggle&&nav){toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.dataset.open=String(open);});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){toggle.setAttribute('aria-expanded','false');nav.dataset.open='false';toggle.focus();}});}
 document.querySelectorAll('[data-print]').forEach(b=>b.addEventListener('click',()=>window.print()));
 const list=document.querySelector('[data-checklist]');if(list){const boxes=[...list.querySelectorAll('input[type=checkbox]')],status=list.querySelector('[data-checklist-status]');const update=()=>{const n=boxes.filter(x=>x.checked).length;status.textContent=document.documentElement.lang==='es'?`${n} de ${boxes.length} completados`:`${n} of ${boxes.length} completed`;};boxes.forEach(b=>b.addEventListener('change',update));update();}
})();
