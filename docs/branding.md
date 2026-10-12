# Doberman Deals brand system

The customer-facing hub uses the original supplied palette: black #000000, red #E63946, gold #FFC107, navy #1D3557, gray #6C757D and white #FFFFFF. `content/brand.json` owns the palette and the six social destinations extracted from the user's signature. `scripts/build-hub.py` regenerates `assets/css/brand-tokens.css`, semantic footer links, and Organization social references. The Google review destination is a footer link, not an Organization sameAs profile.

The visual direction is bold canine editorial. Bebas Neue supplies display headings and the wordmark; Roboto supplies reading copy and controls. Fonts are self-hosted under `assets/fonts/`, with their original SIL Open Font License files. The existing crest and social artwork are retained. White social glyphs are inverted only in CSS on white icon tiles.

Use gold with black text for primary actions. Use navy with white text for reading navigation. Reserve bright red for accents; deep red #B72231 is the accessible small-text variant on white. Use #515B65 for secondary reading text. Typography and controls are responsive; interactions retain visible focus and reduced-motion support.

The printable brand guide and asset bundle are delivered separately as `doberman-brand-kit.zip`. Brand documentation is not deployed as customer content. Website pages contain owner guidance, source/credit links and normal policies, without developer progress labels or invented credibility claims.

On the staging branch, run `python3 scripts/build-hub.py` and `CF_PAGES_BRANCH=staging node scripts/build.mjs`. Revalidate the contextual link graph after template changes. Production publishing remains a separate editorial release.
