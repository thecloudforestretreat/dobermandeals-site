# Final staging QA — hold production promotion

Audited October 13, 2026. All 260 planned locale routes are built. This is a technical QA pass with unresolved acceptance requirements, not a 10/10 score, factual certification or approval to launch.

## Verified

- Complete deployed crawl: 260 HTTP 200 routes, language, single H1, canonical, JSON-LD parsing, noindex and minimum six unique contextual same-language incoming/outgoing links. The earlier full audit covered bd54e8e, with the source replacement verified at 4a702a7. Acceptance follow-up re-crawled all 260 routes at c9f2667 against the authoritative metadata, language, single H1, JSON-LD, staging noindex and refreshed assets.
- Sitemap exactly covers the 260 planned routes with no missing or extra locations. No duplicate descriptions. Local HTML/assets/anchors resolve after corrections; explicit alt attributes exist throughout the audited HTML including fragments.
- Build integration, analytics privacy/allowlist, contact, private notifier, resource and waitlist tests pass. The acceptance follow-up additionally saved deployed EN/ES contact, resource and waitlist submissions using the public business email. Contact and resource notifications were verified in the business inbox with the exact labeled test bodies. Waitlist success confirms the handler completed its save; no direct KV-console inspection is claimed.
- Named language/contextual/directory events dispatch in mocked production from actual rendered attributes. Staging excludes Google scripts. Public production configuration contains GTM-TSFMW3ZV and G-FGX9MBEM2R, loaded before head.js. The public GTM script returned HTTP 200 and includes the configured GA4 ID. Acceptance follow-up verified GA4 Realtime receipt of one production landing-page view and session_start, plus the configured content custom dimensions. The GSC domain property shows verified ownership, a Google Analytics association and valid robots files. New hub named-event receipt in actual GA4 remains a production acceptance check; those events were only tested with mocks because staging excludes Google scripts.
- Eight representative routes at 320px, including English/Spanish home and contact, budget, a health guide, directory and waitlist, have no horizontal overflow or failed completed images, with sticky headers and no Google tracking scripts. Tablet home at 768px also fits. Bilingual menu, checklist, FAQ, calculator and local-note checks are recorded in the batch browser evidence. This is representative UI testing, not a full WCAG certification of every route.
- Live subscribe redirect is 301 to the waitlist, nonexistent routes return 404, staging has X-Robots-Tag noindex/nofollow. Production still serves its prior subscription landing page with a three-URL sitemap; the hub was not promoted. Production build correctly refuses the 260 pending editorial releases.

## Corrected

1. Named content events used data-dd-event while tracking listened for data-analytics-event. Fixed generated links and added named directory-card identifiers, with rendered-click regression tests.
2. Plain error page replaced with brand styling, desktop/mobile navigation and English/Spanish recovery links; verified at a real 404 URL.
3. Legacy header fragments had nonexistent account/contact and landing-anchor targets. Replaced with valid destinations; social fragments now have alt text, safe new-tab relations and a corrected icon path.
4. Web manifest had empty name/short_name. Added Doberman Deals branding.
5. Longevity research repository hostname failed DNS in the source scan. Replaced the PDF link with the same paper’s [current publisher article](https://www.nature.com/articles/s41598-023-50458-w), verified through the web reader. Article notes a 2024 correction; clinical/editor review should use the updated publication.

## Remaining before launch

| Requirement | Evidence / action |
|---|---|
| Editorial approval | All 260 manifest releases remain pending. 258 sitemap rows require expert/editor and native Spanish review; two owner-story rows also require verified accounts and permission. Do not mark these complete by generation. |
| Content/evidence quality | Every original-evidence record has pending work/review. Earlier batches have not received the full retrospective evidence-first pass. Prioritize health, nutrition, insurance and substantive EN/ES review; retain licensed reusable media with attribution, improve page-specific evidence where useful, and preserve genuine story consent. The owner clarified that original photography/video is not a launch prerequisite. No named veterinary/trainer review is available yet; no clinical approval is claimed. |
| Production event acceptance | EN/ES deployed form saves, inbox delivery, existing production page_view receipt and current GSC ownership are now verified. Verify the new hub event names and dimensions in GA4 after authorized production promotion. Staging tracking exclusion is intentional. |
| Performance | PageSpeed home lab checks now show 95–97 mobile performance and 100 desktop performance, with 100 accessibility and best practices. Latest measured mobile LCP 2.4s, TBT 0ms and CLS 0; desktop LCP 0.4s. SEO 69 is caused by intentional staging noindex, with no other failed SEO audit shown. Field CWV has no data and is not claimed as passed. Further render-blocking/image savings remain optional improvements. |
| Source review | Availability checked for 115 unique source URLs. No 404 was observed; access-restricted responses are not proof of broken links. OFA and the screening-paper PubMed page were verified through the web reader after atypical HTTP responses. Link availability does not validate every medical/content claim. |
| Production preparation | Only after acceptance: approved release scope, production canonicals/hreflang/sitemap/indexing checks, production form/event verification and Search Console sitemap submission. Keep staging isolated. |

Evidence files live in the project research output: final-qa-static.json, final-qa-deployed.json, final-qa-browser.json, final-qa-live-headers.json, final-qa-source-availability.json, final-qa-acceptance.json and final-qa-404.png. The authoritative sitemap now matches all 260 rendered titles/descriptions/H1s, records the South American Spanish vocabulary pass and accepts properly licensed reusable media. 48 original training/demo-media briefs were revised to make original photography optional; human approval statuses were not marked complete. No DNS, account permission or production promotion was performed.

## Acceptance follow-up — October 13, 2026

- Preserved the three licensed Wikimedia source photographs and visible author/license attribution; added responsive AVIF and WebP with JPEG fallback. Small puppy AVIF is 74,769 bytes versus the original 880,617-byte JPEG. Self-hosted fonts now use WOFF2 with accents retained; the header/footer logo is 14,003 bytes instead of 137,620. License transformation notes describe both image formats.
- Added a South American Spanish vocabulary/style adapter while preserving `/es/` routes, accents, source URLs and safety meaning. This is an automated editorial pass, not a claim of native human sign-off or a full retrospective substantive review. The language record in the sitemap states that limit.
- Long meta descriptions now prefer complete sentences. Corrected the final waitlist heading to “Inscríbete para recibir novedades.”
- Caught and corrected a picture-wrapper grid placement issue during visual inspection; refreshed CSS asset versions so cached styles do not preserve the issue. Latest deployed EN/ES hero geometry and Spanish accent rendering were verified at desktop. The viewport override tool did not actually change the measured width in this follow-up, so no new 375px result is claimed; the prior 320px representative QA and Lighthouse emulated mobile audit remain the mobile evidence.
- Deployment c9f2667 completed successfully on Cloudflare Pages staging. The hub remains unpromoted. All link/build/footer/config/contact/notifier/resource/waitlist regression checks passed after these changes.

PageSpeed report: https://pagespeed.web.dev/analysis/https-staging-dobermandeals-com/f0huaby3k2?form_factor=mobile (95 mobile / 100 desktop). Earlier optimized run: 0tt0mzxygc (97 mobile / 100 desktop); scores vary between lab runs. These home-page lab scores do not certify every route or search ranking.

Additional proof: acceptance-live-checks.json, acceptance-spanish-home.png, acceptance-pagespeed-mobile-final.png, acceptance-pagespeed-desktop.png, acceptance-contact-en.png, acceptance-contact-es.png, acceptance-waitlist-en.png, acceptance-waitlist-es.png, acceptance-resource-inbox.png, acceptance-ga4-realtime.png, acceptance-gsc.png and acceptance-sitemap-metadata.png in the research output directory.
