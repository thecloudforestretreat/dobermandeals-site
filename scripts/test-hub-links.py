import tempfile,json,subprocess,sys
from pathlib import Path
checker=Path(__file__).with_name('check-hub-links.py')
with tempfile.TemporaryDirectory() as temp:
 root=Path(temp);pages=[f'/test-{i}/' for i in range(7)]
 manifest=root/'manifest.json';manifest.write_text(json.dumps([dict(page_path=p,language='en',published=True) for p in pages]+[dict(page_path='/es/',language='es',published=True)]))
 for p in pages+['/es/']:
  directory=root/p.strip('/');directory.mkdir()
  targets=[x for x in pages if x!=p] if p!='/es/' else []
  directory.joinpath('index.html').write_text('<html><head><link rel="canonical" href="https://dobermandeals.com'+p+'"></head><body><main>'+''.join('<a href="'+x+'">Guide</a>' for x in targets)+'<nav><a href="/es/">Español</a></nav></main></body></html>')
 # An unpublished or untranslated locale page cannot make an otherwise valid
 # English graph pass: only actual qualifying pages count.
 data=json.loads(manifest.read_text());data[-1]['published']=False;manifest.write_text(json.dumps(data))
 def run():return subprocess.run([sys.executable,str(checker),str(root),str(manifest)],capture_output=True,text=True)
 assert run().returncode==0
 file=root/'test-0/index.html';source=file.read_text();file.write_text(source.replace('<a href="/test-1/">Guide</a>','<nav><a href="/test-1/">Guide</a></nav>'))
 assert run().returncode==1,'Global navigation must not meet the minimum'
 file.write_text(source.replace('<a href="/test-1/">Guide</a>','<a rel="nofollow" href="/test-1/">Guide</a>'))
 assert run().returncode==1,'Nofollow links must not meet the minimum'
 file.write_text(source.replace('</head>','<meta name="robots" content="noindex"></head>'))
 assert run().returncode==1,'Noindex pages must not satisfy a release gate'
print('Hub link release gate: actual 6-link graph passes; navigation, nofollow and noindex substitutions fail. No live hub pass claimed.')
