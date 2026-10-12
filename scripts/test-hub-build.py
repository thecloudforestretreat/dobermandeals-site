import tempfile,json,subprocess,shutil
from pathlib import Path
repo=Path(__file__).resolve().parents[1]
with tempfile.TemporaryDirectory() as temp:
 root=Path(temp)/'site';shutil.copytree(repo,root,ignore=shutil.ignore_patterns('.git','dist','__pycache__'))
 content=root/'content';content.mkdir(exist_ok=True);manifest=[];paths=[f'/hub-fixture-{i}/' for i in range(7)]
 for i,p in enumerate(paths):
  folder=root/p.strip('/');folder.mkdir()
  folder.joinpath('index.html').write_text('<html lang="en"><head><link rel="canonical" href="https://dobermandeals.com'+p+'"></head><body><main>'+''.join('<a href="'+q+'">Guide</a>' for q in paths if q!=p)+'</main></body></html>')
  manifest.append(dict(page_path=p,language='en',pair_id='TEST-'+str(i),topic_cluster='training',template_type='article',published=True))
 content.joinpath('published-hub-manifest.json').write_text(json.dumps(manifest))
 result=subprocess.run(['node','scripts/build.mjs'],cwd=root,capture_output=True,text=True);assert result.returncode==0,result.stderr
 built=root/'dist/hub-fixture-0/index.html';html=built.read_text();assert 'data-pair-id="TEST-0"' in html;assert html.index('/assets/js/site-config.js')<html.index('/assets/js/head.js')
 source=root/'hub-fixture-0/index.html';source.write_text(source.read_text().replace('<a href="/hub-fixture-1/">Guide</a>',''))
 result=subprocess.run(['node','scripts/build.mjs'],cwd=root,capture_output=True,text=True);assert result.returncode!=0;assert 'contextual link minimums failed' in result.stderr
print('Build integration passed: published hub HTML/context copied, config ordered, and a real link shortfall blocks deployment.')
