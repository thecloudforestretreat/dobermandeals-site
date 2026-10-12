# First bilingual hub batch

Target: https://staging.dobermandeals.com/ on the `staging` Git branch.

The enriched Google Sheet is authoritative:
https://docs.google.com/spreadsheets/d/1w3zmXtVMaKc-nIBgrvkF-ZwO1DUoFw2lbwp3_1zl62E/edit?gid=1464736159

`content/sitemap-plan.csv` is its dated build snapshot. `content/first-batch-copy.py` contains customer copy. `scripts/build-hub.py` renders the selected page pairs and their release-specific contextual graph. Regenerate with `python3 scripts/build-hub.py`, then run `node scripts/build.mjs`. First scope: 12 subject/home pairs plus seven trust pairs, 38 URLs.

Every page is delivered to staging for review. `editorial_release: pending` is distinct from a successful preview deployment. Cloudflare builds on branch `main` reject pending hub content. A production release requires owner authorization and the source-of-truth acceptance checks, including qualified training review and native Spanish review. Do not fabricate expert names, endorsements or professional review dates.

The preview build uses noindex/nofollow HTML and robots exclusion, preview-host canonical/hreflang URLs, and excludes production Google analytics by hostname. Its contextual graph is checked before applying preview indexing exclusions. Six unique main-content links in each direction are required per same-language page; global navigation and counterpart links do not count.

Image provenance and licenses are in `content/image-licenses.json`. The original author, source and Creative Commons license are visibly linked beside each photograph. Wikimedia supplied the resized derivatives; CSS applies a presentation crop. Image licenses remain in force; they do not license the whole site.

Checklists run only in the browser, with no storage or input sent to analytics. Print controls use the browser print dialog. No new credential or form is introduced in this batch. The existing server-validated waitlist remains separate.

Pending before production: named appropriate review of training content, native Spanish editorial review, finalized policy/legal review where appropriate, claim/source reconciliation, real-user performance evidence, production measurement and GSC fetch verification. Staging is not a claim of 10/10 content quality or indexing readiness.
