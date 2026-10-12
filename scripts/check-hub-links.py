"""Release check for actual server-rendered hub links, not sitemap intentions.
Usage: python3 scripts/check-hub-links.py dist path/to/published-hub-manifest.json
Manifest is [{"page_path":"/training/", "language":"en", "published":true},...].
Run only when hub content is built; current 3-page coming-soon site is not the hub.
"""
import sys,json,collections,urllib.parse
from pathlib import Path
from html.parser import HTMLParser
class Links(HTMLParser):
 def __init__(self):super().__init__();self.stack=[];self.links=[];self.robots='';self.canonical=''
 def handle_starttag(self,tag,attrs):
  d=dict(attrs)
  if tag=='meta' and d.get('name','').lower()=='robots':self.robots=d.get('content','').lower()
  if tag=='link' and d.get('rel')=='canonical':self.canonical=d.get('href','')
  if tag not in ('meta','link','br','hr','img','input','source','wbr','area','base','col','embed','param','track'):self.stack.append(tag)
  if tag=='a' and 'main' in self.stack and not any(t in self.stack for t in ('header','footer','nav')) and d.get('href') and not any(x in d.get('rel','').lower().split() for x in ('nofollow','sponsored')):self.links.append(d['href'])
 def handle_endtag(self,tag):
  if tag in self.stack:self.stack=self.stack[:len(self.stack)-1-self.stack[::-1].index(tag)]
if __name__=='__main__':
 root=Path(sys.argv[1]);manifest=json.loads(Path(sys.argv[2]).read_text());published={r['page_path']:r for r in manifest if r.get('published') is True}
 if not published:raise SystemExit('No published hub pages to validate; this is not a live link pass.')
 incoming=collections.defaultdict(set);outgoing=collections.defaultdict(set);errors=[]
 for p,row in published.items():
  file=root/(p.strip('/')+'/index.html' if p!='/' else 'index.html')
  if not file.exists():errors.append(p+' missing HTML');continue
  parser=Links();parser.feed(file.read_text())
  if 'noindex' in parser.robots or 'nofollow' in parser.robots:errors.append(p+' is not indexable/followable');continue
  if parser.canonical!='https://dobermandeals.com'+p:errors.append(p+' must self-canonicalize before link audit');continue
  for href in parser.links:
   u=urllib.parse.urlsplit(urllib.parse.urljoin('https://dobermandeals.com'+p,href))
   if u.hostname!='dobermandeals.com' or u.query:continue
   target=u.path
   if target in published and target!=p and published[target]['language']==row['language']:
    outgoing[p].add(target);incoming[target].add(p)
 for p in published:
  if len(incoming[p])<6 or len(outgoing[p])<6:errors.append(f'{p}: {len(incoming[p])} contextual inlinks, {len(outgoing[p])} contextual outlinks; minimum 6 each')
 print(json.dumps({'published_pages':len(published),'errors':errors,'scope':'Rendered main-content links; excludes global nav/footer, untranslated or unpublished targets'},indent=2))
 if errors:raise SystemExit(1)
