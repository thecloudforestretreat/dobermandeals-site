# Doberman Deals production launch

Owner authorized the bilingual hub launch and production sitemap resubmission on October 14, 2026. Release commit: 644921b. Cloudflare Pages production deployment succeeded. Production source scope is 260 locale routes (130 English/Spanish pairs).

Owner authorization is recorded in content/production-release.json. It does not claim veterinary/trainer review, native human Spanish sign-off or firsthand product testing; those review/evidence records remain pending. Licensed reusable images retain source and license attribution.

The production sitemap contains 260 canonical apex URLs and reciprocal English/Spanish/x-default alternates. Removed the prior hard-coded lastmod value because accurate page-specific modification records are not yet maintained. Legacy /privacy/ redirects to /about/privacy/. Staging remains noindex and isolated from Google tracking.

Production CONTACT_NOTIFIER binding to the existing private dobermandeals-contact-notifier service was missing at launch. Owner specifically approved adding it, and the saved production binding was verified in Cloudflare. This commit triggers deployment with that existing service binding. The configured email recipient remains dobermandeals3@gmail.com. Production inbox verification follows deployment.

Rollback point before hub promotion: 69f5388. Reverting the launch through Git/Pages restores the prior production landing page; do not erase staging work or review records.
