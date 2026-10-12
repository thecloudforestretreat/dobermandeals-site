# dobermandeals-site
Staging and production site for dobermandeals.com.

## Deployment

Cloudflare Pages project: `dobermandeals-site`, connected to this GitHub repository.
Production branch: `main`. Preview branch: `staging`.
Build command: `node scripts/build.mjs`. Output directory: `dist`.
Pages Functions are compiled from the root `functions/` directory.

`dobermandeals.com` serves production. `www.dobermandeals.com` redirects to the apex with the path preserved.
`staging.dobermandeals.com` points to `staging.dobermandeals-site.pages.dev`.
Staging and the production pages.dev hostname carry `noindex` headers.

## Analytics and signup protection

- GTM: `GTM-TSFMW3ZV`, published Google tag for GA4 `G-FGX9MBEM2R`.
- GA4 property: `506429295`; web stream: `12208301838`.
- Only apex/www production pages load Google tracking. Testing routes are excluded.
- Enhanced measurement tracks page views, scrolls, outbound links, search, video and downloads. Automatic form interactions are disabled.
- Confirmed waitlist saves emit `generate_lead`, configured as a key event once per session with no invented monetary value.
- Search Console domain property: `dobermandeals.com`, verified using DNS for `dobermandeals3@gmail.com` and linked to the GA4 stream.
- Cloudflare Web Analytics is enabled through Pages.
- Turnstile widget: `DobermanDeals Forms`, Managed mode, no pre-clearance. The apex hostname also allows its subdomains.

Required Pages runtime settings in both Production and Preview:

- Encrypted secret `TURNSTILE_SECRET_KEY`. Never commit the value or put it in client HTML.
- KV namespace binding `WAITLIST`, using `dobermandeals-waitlist`.

The signup endpoint verifies the request origin, email, consent, Turnstile result, hostname and action before storing an email.
View saved signups in Cloudflare Workers KV → `dobermandeals-waitlist` → KV Pairs. Production keys start with `signup:`.
Staging keys start with `staging:` and expire after 24 hours. The waitlist stores signups; it does not automatically send an email campaign.

## Checks

Run `node scripts/test-waitlist.mjs` and `node scripts/build.mjs`.
The handler tests use local fixtures and never send a real signup or call Turnstile.
After deployment, verify HTTPS, the www redirect, production indexability, staging noindex, GTM loading, GA4 realtime, and a staging form submission.
Google crawl/indexing and the sitemap status may take time to refresh after the migration.
