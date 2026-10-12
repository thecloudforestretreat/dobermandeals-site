"""Render the approved first-batch scope from the enriched sitemap and bilingual copy.
This branch targets staging; editorial approval is recorded separately from deployment.
"""
import csv,json,html,re,runpy,collections
from pathlib import Path
R=Path(__file__).resolve().parents[1];P=list(csv.DictReader((R/'content/sitemap-plan.csv').open(encoding='utf-8-sig')));COPY=runpy.run_path(str(R/'content/first-batch-copy.py'))['COPY'];selected=[r for r in P if r['pair_id'] in COPY];by={(r['pair_id'],r['language']):r for r in selected};images=json.loads((R/'content/image-licenses.json').read_text());photo={Path(r['local_path']).name:r for r in images};H=html.escape;ORIGIN='https://dobermandeals.com'
BRAND=json.loads((R/'content/brand.json').read_text())
tokens={'black':'black','red':'red','gold':'gold','navy':'blue','gray':'gray'}
(R/'assets/css/brand-tokens.css').write_text(':root{'+''.join('--dd-'+v+':'+BRAND['palette'][k]+';' for k,v in tokens.items())+'}')
training_source='https://avsab.org/wp-content/uploads/2021/08/AVSAB-Humane-Dog-Training-Position-Statement-2021.pdf'
SRC={2:[('AKC: Doberman Pinscher','https://www.akc.org/dog-breeds/doberman-pinscher/')],4:[('AVSAB: humane dog training',training_source)],17:[('AKC: Doberman Pinscher','https://www.akc.org/dog-breeds/doberman-pinscher/')],26:[('AKC: early puppy skills','https://www.akc.org/expert-advice/training/first-behaviors-teach-puppy/')],27:[('AKC: introducing a crate','https://www.akc.org/expert-advice/training/puppy-taraining/how-to-crate-train-a-puppy/')],34:[('AVSAB: humane dog training',training_source)],35:[('AKC: puppy potty training','https://www.akc.org/expert-advice/training/how-to-potty-train-a-puppy/')],36:[('AKC: introducing a crate','https://www.akc.org/expert-advice/training/puppy-taraining/how-to-crate-train-a-puppy/')],126:[('Google: privacy and terms','https://policies.google.com/privacy'),('Cloudflare: privacy policy','https://www.cloudflare.com/privacypolicy/')]}
# Build a contextual subgraph for this release. Never point cards at unbuilt URLs.
subj=[k for k in COPY if by[(k,'en')]['topic_cluster']!='trust'];trust=[k for k in COPY if by[(k,'en')]['topic_cluster']=='trust'];edges={k:set() for k in COPY}
for k in subj:
 r=by[(k,'en')];planned=set(r['internal_links_to'].split(' | '))
 def rank(other):
  o=by[(other,'en')];return (o['page_path'] not in planned,o['topic_cluster']!=r['topic_cluster'],o['template_type']!='hub',int(other[-3:]))
 for other in sorted((x for x in subj if x!=k),key=rank)[:6]:edges[k].add(other);edges[other].add(k)
 edges[k].update(['DD-015','DD-121','DD-122'])
for k in trust:edges[k].update(x for x in trust if x!=k)
for k in ['DD-015','DD-121','DD-122']:edges[k].update(['DD-001','DD-002','DD-003','DD-004'])
LABELS={'en':dict(home='Home',basics='Doberman basics',puppies='Puppies',training='Training',about='About',menu='Menu',skip='Skip to content',next='Your next steps',guide='Read the guide',sources='Sources and further reading',contents='On this page',print='Print this guide',check='Your practical checklist',checkhelp='Use this checklist here, or print it to keep with your notes.',updated='Updated October 12, 2026',author='By Doberman Deals',credit='Photo',crop='layout crop',start='Start with your puppy',learn='Explore training',trust='Clear guidance for everyday decisions',footer='Practical Doberman guides for a thoughtful life together.',read='Read our editorial approach'), 'es':dict(home='Inicio',basics='La raza dóberman',puppies='Cachorros',training='Adiestramiento',about='Nosotros',menu='Menú',skip='Ir al contenido',next='Tus próximos pasos',guide='Lee la guía',sources='Fuentes y lecturas adicionales',contents='En esta página',print='Imprime esta guía',check='Tu lista práctica',checkhelp='Utiliza la lista aquí o imprímela para acompañar tus notas.',updated='Actualizado el 12 de octubre de 2026',author='Por Doberman Deals',credit='Foto',crop='recorte de presentación',start='Empieza con tu cachorro',learn='Explora el adiestramiento',trust='Orientación clara para decisiones cotidianas',footer='Guías prácticas para una convivencia cuidadosa con tu dóberman.',read='Nuestro enfoque editorial')}
def link(pair,lang):return by[(pair,lang)]['page_path']
def title(pair,lang):return COPY[pair][lang]['title']
def credit(img,lang):
 a=re.sub('<[^>]+>','',img['author']);a=html.unescape(a)
 return f'<figcaption class="dd-photo-credit">{LABELS[lang]["credit"]}: <a href="{H(img["source"])}">{H(a)}</a> · <a href="{H(img["license_url"])}">{H(img["license"])}</a> · {LABELS[lang]["crop"]}</figcaption>'
def image_for(row):
 if row['topic_cluster']=='puppies' or row['pair_id'] in ('DD-035','DD-036'):return photo['puppy.jpg']
 if row['pair_id']=='DD-018':return photo['doberman-outdoors.jpg']
 return photo['doberman-portrait.jpg']
def img_html(img,lang,hero=False):
 alt={'puppy.jpg':('A young Doberman resting on grass with natural ears','Un cachorro dóberman sobre el césped con orejas naturales'),'doberman-outdoors.jpg':('A Doberman standing in shallow water with a natural tail','Un dóberman en agua poco profunda con su cola natural'),'doberman-portrait.jpg':('Close-up portrait of a black and rust Doberman with natural ears','Retrato de un dóberman negro y fuego con orejas naturales')}[Path(img['local_path']).name][lang=='es']
 return f'<img class="{"dd-hero-image" if hero else ""}" src="{img["local_path"]}" alt="{alt}" width="{img["width"]}" height="{img["height"]}" decoding="async" fetchpriority="high">'
def header(row):
 lang=row['language'];L=LABELS[lang];n=''.join(f'<a href="{link(k,lang)}"'+(' aria-current="page"' if row['pair_id']==k else '')+f'>{L[l]}</a>' for k,l in [('DD-002','basics'),('DD-003','puppies'),('DD-004','training'),('DD-015','about')])
 return f'<a class="dd-skip-link" href="#main">{L["skip"]}</a><header class="dd-header"><div class="dd-header-inner"><a class="dd-wordmark" href="{link("DD-001",lang)}"><img src="/assets/images/dd_logo_transparent.png" alt="" width="42" height="42"><span class="dd-brand-name">Doberman<span>Deals</span></span></a><button class="dd-menu-button" data-menu-toggle aria-expanded="false" aria-controls="hub-navigation">{L["menu"]}</button><nav id="hub-navigation" aria-label="{"Main navigation" if lang=="en" else "Navegación principal"}">{n}<a class="dd-locale" href="{row["counterpart_path"]}" hreflang="{"es" if lang=="en" else "en"}" lang="{"es" if lang=="en" else "en"}" data-dd-event="language_switch">{"Español" if lang=="en" else "English"}</a></nav></div></header>'
def footer(lang):
 L=LABELS[lang];ls=''.join(f'<a href="{link(k,lang)}">{H(title(k,lang))}</a>' for k in trust)
 social=''.join(f'<a href="{H(x["url"])}" target="_blank" rel="noopener noreferrer" aria-label="{H(x["name"])} ({"opens in a new tab" if lang=="en" else "se abre en una pestaña nueva"})" title="{H(x["name"])}"><img src="/assets/images/icons/{x["icon"]}" alt="" width="27" height="27"><span class="dd-sr-only">{H(x["name"])}</span></a>' for x in BRAND['socials'])
 follow='Connect with the pack' if lang=='en' else 'Conecta con la comunidad'
 follow_copy='Find Doberman Deals on your favorite social channels. Share the everyday moments that make life with your dog special.' if lang=='en' else 'Encuentra Doberman Deals en tus redes favoritas. Comparte los momentos que hacen especial la vida con tu perro.'
 button='Find us on Instagram' if lang=='en' else 'Encuéntranos en Instagram'
 band=f'<div class="dd-community-band"><div><h2>{follow}</h2><p>{follow_copy}</p></div><a class="dd-button" href="{BRAND["socials"][0]["url"]}" target="_blank" rel="noopener noreferrer">{button} ↗</a></div>'
 explore=''.join(f'<a href="{link(k,lang)}">{L[n]}</a>' for k,n in [('DD-002','basics'),('DD-003','puppies'),('DD-004','training')])
 return f'<footer class="dd-footer"><div class="dd-container">{band}<div class="dd-footer-top"><div class="dd-footer-brand"><a class="dd-wordmark" href="{link("DD-001",lang)}"><img src="/assets/images/dd_logo_transparent.png" alt="" width="64" height="64"><span class="dd-brand-name">Doberman<span>Deals</span></span></a><p>{L["footer"]}</p><div class="dd-socials" aria-label="{follow}">{social}</div></div><div><h3>{"Explore & learn" if lang=="en" else "Explora y aprende"}</h3><div class="dd-footer-links">{explore}<a href="mailto:dobermandeals3@gmail.com">dobermandeals3@gmail.com</a></div></div><div><h3>{"About & policies" if lang=="en" else "Nosotros y políticas"}</h3><div class="dd-footer-links">{ls}</div></div></div><div class="dd-footer-bottom"><span>© 2026 Doberman Deals</span><span>{"For the love of Dobermans." if lang=="en" else "Por el amor a los dóberman."}</span></div></div></footer>'

def related(row):
 lang=row['language'];k=row['pair_id'];L=LABELS[lang];items=[]
 for other in sorted(edges[k],key=lambda x:(by[(x,lang)]['topic_cluster']=='trust',int(x[-3:]))):
  copy=COPY[other][lang];items.append(f'<a href="{link(other,lang)}" data-dd-event="related_content_click" data-target-pair-id="{other}">{H(copy["title"])}<small>{H(copy["intro"])}</small></a>')
 return '<section class="dd-section dd-related"><h2>'+L['next']+'</h2><div class="dd-related-grid">'+''.join(items)+'</div></section>'
manifest=[]
for row in selected:
 k=row['pair_id'];num=int(k[-3:]);lang=row['language'];L=LABELS[lang];c=COPY[k][lang];t=c['title'];intro=c['intro'];url=ORIGIN+row['page_path'];other=ORIGIN+row['counterpart_path'];is_hub=row['template_type']=='hub';is_trust=row['topic_cluster']=='trust';img=image_for(row)
 desc=intro if len(intro)<=170 else intro[:167].rsplit(' ',1)[0]+'.'
 bread=f'<nav class="dd-breadcrumb" aria-label="{"Breadcrumb" if lang=="en" else "Ruta de navegación"}"> <a href="{link("DD-001",lang)}">{L["home"]}</a><span aria-hidden="true">/</span><span>{H(t)}</span></nav>' if num!=1 else ''
 sections=''.join(f'<section id="section-{i+1}"><h2>{H(h)}</h2><p>{H(p)}</p></section>' for i,(h,p) in enumerate(c['sections']))
 source_html=''
 if num in SRC:
  source_html='<section class="dd-sources"><h2>'+L['sources']+'</h2><ul>'+''.join(f'<li><a href="{H(u)}">{H(label)}</a></li>' for label,u in SRC[num])+'</ul></section>'
 checks=''
 if c['checklist']:
  checks=f'<section class="dd-checklist" data-checklist><h2>{L["check"]}</h2><p>{L["checkhelp"]}</p>'+''.join(f'<label><input type="checkbox"> <span>{H(item)}</span></label>' for item in c['checklist'])+'<p class="dd-checklist-status" data-checklist-status role="status" aria-live="polite"></p></section>'
 if c['checklist']:
  notes_title='Notes for your next step' if lang=='en' else 'Notas para tu próximo paso'
  notes_help='Add a brief note beside each task, then print this guide. These notes stay in this page and are not saved or sent.' if lang=='en' else 'Añade una nota junto a cada tarea e imprime la guía. Las notas permanecen en esta página, sin guardarse ni enviarse.'
  checks+='<section class="dd-owner-notes"><h2>'+notes_title+'</h2><p>'+notes_help+'</p>'+''.join('<label for="note-'+str(i)+'">'+H(item)+'</label><textarea id="note-'+str(i)+'" rows="2" maxlength="400"></textarea>' for i,item in enumerate(c['checklist']))+'</section>'
 if is_hub:
  hero=f'<section class="dd-hub-hero"><div class="dd-hero-copy"><p class="dd-kicker">{"Life with a Doberman" if lang=="en" else "La vida con un dóberman"}</p><h1>{H(t)}</h1><p class="dd-hero-lead">{H(intro)}</p><div class="dd-hero-buttons"><a class="dd-button" href="{link("DD-026",lang)}">{L["start"]}</a><a class="dd-button dd-button-secondary" href="{link("DD-034",lang)}">{L["learn"]}</a></div></div>{img_html(img,lang,True)}</section>'+credit(img,lang)
  featured=['DD-026','DD-028','DD-034'] if num==1 else [x for x in subj if x!=k and by[(x,lang)]['topic_cluster']==row['topic_cluster']]
  cards=''.join(f'<a class="dd-card" href="{link(x,lang)}" data-dd-event="select_content" data-item-id="{x}"><img class="dd-card-image" src="{image_for(by[(x,lang)])["local_path"]}" alt="" width="960" height="638" loading="lazy" decoding="async"><div class="dd-card-copy"><span class="dd-kicker">{H(L["puppies"] if by[(x,lang)]["topic_cluster"]=="puppies" else L["training"] if by[(x,lang)]["topic_cluster"]=="training" else L["basics"])}</span><h3>{H(title(x,lang))}</h3><p>{H(COPY[x][lang]["intro"])}</p><span class="dd-card-link">{L["guide"]}<b aria-hidden="true">↗</b></span></div></a>' for x in featured)
  card_credits='<div class="dd-photo-credit">'+('Photographs, cropped for display: ' if lang=='en' else 'Fotografías, recortadas para presentación: ')+ ' · '.join('<a href="'+H(x['source'])+'">'+html.unescape(re.sub('<[^>]+>','',x['author']))+'</a> (<a href="'+H(x['license_url'])+'">'+H(x['license'])+'</a>)' for x in {image_for(by[(i,lang)])['local_path']:image_for(by[(i,lang)]) for i in featured}.values())+'</div>'
  topics='<div class="dd-topic-strip">'+''.join(f'<a href="{link(i,lang)}">{LABELS[lang][n]}</a>' for i,n in [('DD-002','basics'),('DD-003','puppies'),('DD-004','training')])+'</div>'

  content=hero+topics+f'<section class="dd-section"><div class="dd-home-label"><h2>{"A useful place to begin" if lang=="en" else "Un buen punto de partida"}</h2></div><div class="dd-grid">{cards}</div>{card_credits}</section><div class="dd-hub-story">{sections}{source_html}</div>'+related(row)
 else:
  head=f'<header class="dd-article-header"><p class="dd-kicker">{L["about"] if is_trust else L["puppies"] if row["topic_cluster"]=="puppies" else L["training"] if row["topic_cluster"]=="training" else L["basics"]}</p><h1>{H(t)}</h1><p class="dd-lead">{H(intro)}</p><p class="dd-byline">{L["author"]} · {L["updated"]}</p></header>'
  visual='' if is_trust else '<figure class="dd-article-visual">'+img_html(img,lang)+credit(img,lang)+'</figure>'
  toc='<aside class="dd-toc"><h2>'+L['contents']+'</h2><ol>'+''.join(f'<li><a href="#section-{i+1}">{H(h)}</a></li>' for i,(h,_) in enumerate(c['sections']))+'</ol><button class="dd-button" data-print>'+L['print']+'</button></aside>'
  content=head+visual+'<div class="dd-article-layout"><article class="dd-prose">'+sections+checks+source_html+related(row)+'</article>'+toc+'</div>'
 schemas=[{'@context':'https://schema.org','@type':'Organization','@id':ORIGIN+'/#organization','name':'Doberman Deals','url':ORIGIN,'email':'dobermandeals3@gmail.com','sameAs':[x['url'] for x in BRAND['socials'] if x['name']!='Google Reviews']},{'@context':'https://schema.org','@type':'WebPage' if is_hub or is_trust else 'Article','@id':url+'#page','url':url,'name':t,'headline':t,'description':desc,'inLanguage':lang,'dateModified':'2026-10-12','publisher':{'@id':ORIGIN+'/#organization'}}]
 if num==1:schemas.append({'@context':'https://schema.org','@type':'WebSite','name':'Doberman Deals','url':ORIGIN,'inLanguage':['en','es']})
 else:schemas.append({'@context':'https://schema.org','@type':'BreadcrumbList','itemListElement':[{'@type':'ListItem','position':1,'name':L['home'],'item':ORIGIN+link('DD-001',lang)},{'@type':'ListItem','position':2,'name':t,'item':url}]})
 enurl=url if lang=='en' else other;esurl=url if lang=='es' else other
 body=header(row)+'<main id="main" class="dd-container">'+bread+content+'</main>'+footer(lang)
 doc=f'<!doctype html><html lang="{lang}" data-pair-id="{k}" data-topic-cluster="{row["topic_cluster"]}" data-template-type="{row["template_type"]}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{H(t)} | Doberman Deals</title><meta name="description" content="{H(desc)}"><link rel="canonical" href="{url}"><link rel="alternate" hreflang="en" href="{enurl}"><link rel="alternate" hreflang="es" href="{esurl}"><link rel="alternate" hreflang="x-default" href="{enurl}"><meta property="og:title" content="{H(t)}"><meta property="og:description" content="{H(desc)}"><meta property="og:url" content="{url}"><meta property="og:type" content="{"website" if is_hub else "article"}"><meta property="og:image" content="{ORIGIN+img["local_path"]}"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/favicon.ico"><link rel="stylesheet" href="/assets/css/fonts.css?v=brand2"><link rel="preload" href="/assets/fonts/bebas-neue.ttf" as="font" type="font/ttf" crossorigin><link rel="stylesheet" href="/assets/css/global.css"><link rel="stylesheet" href="/assets/css/clusters/{"hub" if is_hub else "steps" if row["template_type"]=="steps" else "article"}.css"><link rel="stylesheet" href="/assets/css/hub-site.css?v=brand2"><link rel="stylesheet" href="/assets/css/brand-tokens.css?v=brand2"><script type="application/ld+json">{json.dumps(schemas,ensure_ascii=False).replace("</","<\\/")}</script><script src="/assets/js/hub.js" defer></script></head><body>{body}</body></html>'
 path=R/(row['page_path'].strip('/')+'/index.html' if row['page_path']!='/' else 'index.html');path.parent.mkdir(parents=True,exist_ok=True);path.write_text(doc)
 manifest.append({k:row[k] for k in ['page_path','language','pair_id','topic_cluster','template_type']}|{'published':True,'delivery_environment':'staging','editorial_release':'pending'})
(R/'content/published-hub-manifest.json').write_text(json.dumps(manifest,indent=2))
(R/'content/first-batch-link-graph.json').write_text(json.dumps({k:sorted(v) for k,v in edges.items()},indent=2))
(R/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join('<url><loc>'+ORIGIN+r['page_path']+'</loc><lastmod>2026-10-12</lastmod></url>' for r in selected)+'</urlset>')
print('Rendered',len(selected),'pages /',len(COPY),'pairs; production editorial release remains pending.')
