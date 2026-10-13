import runpy
from pathlib import Path

root = Path(__file__).resolve().parents[1]
context = runpy.run_path(str(root / 'scripts/build-hub.py'))
for language, heading, privacy in [
    ('en', 'About & policies', '/about/privacy/'),
    ('es', 'Nosotros y políticas', '/es/nosotros/privacidad/'),
]:
    rendered = context['footer'](language)
    assert heading in rendered
    assert f'href="{privacy}"' in rendered
    assert '{ls}' not in rendered and 'if lang==' not in rendered
    assert 'mailto:' + context['CONTACT_EMAIL'] in rendered
print('Both localized footers render policy links, email and customer text without template expressions.')
