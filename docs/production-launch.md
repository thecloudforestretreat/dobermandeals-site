# Doberman Deals production launch

Owner authorized the bilingual hub launch and production sitemap resubmission on October 14, 2026. Release commit: 644921b. Cloudflare Pages production deployment succeeded. Production source scope is 260 locale routes (130 English/Spanish pairs).

Owner authorization is recorded in content/production-release.json. It does not claim veterinary/trainer review, native human Spanish sign-off or firsthand product testing; those review/evidence records remain pending. Licensed reusable images retain source and license attribution.

The production sitemap contains 260 canonical apex URLs and reciprocal English/Spanish/x-default alternates. Removed the prior hard-coded lastmod value because accurate page-specific modification records are not yet maintained. Legacy /privacy/ redirects to /about/privacy/. Staging remains noindex and isolated from Google tracking.

Production CONTACT_NOTIFIER binding to the existing private dobermandeals-contact-notifier service was missing at launch. Owner specifically approved adding it, and the saved production binding was verified in Cloudflare. This commit triggers deployment with that existing service binding. The configured email recipient remains dobermandeals3@gmail.com. Production EN contact save and exact labeled email receipt were verified at 08:26 EDT on October 14. Spanish production contact save was also confirmed; inbox follow-up is recorded separately.

Rollback point before hub promotion: 69f5388. Reverting the launch through Git/Pages restores the prior production landing page; do not erase staging work or review records.

Live crawl: all 260 routes passed HTTP 200, indexability, apex canonical, reciprocal hreflang, schema parsing and minimum six same-language contextual inlinks/outlinks. Staging retained noindex; www retained path-preserving 301; legacy /privacy/ returned 301 to /about/privacy/. GSC resubmission returned Success with 260 discovered pages and an October 14 read date. Discovery is not a claim that every URL is indexed.

The authoritative Sheet and CSV mirrors now mark owner-authorized live status and successful live contextual-link QA, retaining pending professional/native review records. Production analytics received bilingual contact-page views. Added an explicit send_to GA4 destination for named events and a routing regression assertion; verify named-event receipt after deployment.
