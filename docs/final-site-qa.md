# Final staging QA — hold production promotion

Audited October 13, 2026. All 260 planned locale routes are built. This is a technical QA pass with unresolved acceptance requirements, not a 10/10 score, factual certification or approval to launch.

## Verified

- Complete deployed crawl: 260 HTTP 200 routes, language, single H1, canonical, JSON-LD parsing, noindex and minimum six unique contextual same-language incoming/outgoing links. The full deployed audit covered bd54e8e; the later source-link replacement is verified on both deployed language pages at 4a702a7.
- Sitemap exactly covers the 260 planned routes with no missing or extra locations. No duplicate descriptions. Local HTML/assets/anchors resolve after corrections; explicit alt attributes exist throughout the audited HTML including fragments.
- Build integration, analytics privacy/allowlist, contact, private notifier, resource and waitlist tests pass. Positive form delivery in this QA used mocks; no new successful live inbox receipt is claimed. Prior live connections are documented separately.
- Named language/contextual/directory events dispatch in mocked production from actual rendered attributes. Staging excludes Google scripts. Public production configuration contains GTM-TSFMW3ZV and G-FGX9MBEM2R, loaded before head.js. The public GTM script returned HTTP 200 and includes the configured GA4 ID. Actual GA4 event receipt, complete GTM trigger/tag behavior and current GSC account status were not freshly verified here.
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
| Content/evidence quality | Every original-evidence record has pending work/review. Earlier batches have not received the full retrospective evidence-first pass. Prioritize health, nutrition, insurance and substantive EN/ES review; finish reviewer-approved visuals, real author/reviewer details and genuine story/media consent. |
| Live forms and analytics | Repeat successful contact, waitlist and resource submissions through the deployed widgets and confirm inbox/KV results; verify GA4 event receipt, actual GTM container configuration and GSC status in the authorized accounts. Staging tracking exclusion is intentional. |
| Performance | No Lighthouse/PageSpeed or field Core Web Vitals result is available in this audit. The puppy JPEG is 880,617 bytes; prioritize responsive/compressed delivery and measured mobile testing. Self-hosted Roboto files total roughly 372 KB across three weights. HTTP timing alone is not a CWV pass. |
| Source review | Availability checked for 115 unique source URLs. No 404 was observed; access-restricted responses are not proof of broken links. OFA and the screening-paper PubMed page were verified through the web reader after atypical HTTP responses. Link availability does not validate every medical/content claim. |
| Production preparation | Only after acceptance: approved release scope, production canonicals/hreflang/sitemap/indexing checks, production form/event verification and Search Console sitemap submission. Keep staging isolated. |

Evidence files live in the project research output: final-qa-static.json, final-qa-deployed.json, final-qa-browser.json, final-qa-live-headers.json, final-qa-source-availability.json, final-qa-acceptance.json and final-qa-404.png. The authoritative sitemap's review gates remain unchanged. No DNS, account permission or production promotion was performed.
