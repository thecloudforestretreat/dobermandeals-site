# Central site configuration

Edit `assets/js/site-config.js` and deploy through GitHub → Cloudflare Pages.
Every full HTML document receives this script before `head.js` during the build.
This is public browser configuration: never put credentials or Turnstile secrets here.

## Future WhatsApp widget

One place controls the phone, localized greeting and enabled state:

```js
contact: {
  whatsapp: {
    enabled: false,
    phoneE164: "", // Replace with your real +country-code number when ready.
    messages: { en: "...", es: "..." },
    labels: { en: "Chat on WhatsApp", es: "Escríbenos por WhatsApp" }
  }
}
```

The future widget should call `DDContact.whatsappUrl(document.documentElement.lang)`.
It returns `null` when disabled or the phone is invalid. Use the returned URL for
the widget link; never hard-code a second phone in page HTML. `whatsapp_click`
tracking records page context without sending the phone or greeting to GA4.
The widget itself is not installed yet, and no phone has been supplied.

## Analytics

GTM container selection is controlled here. GA4 measurement ID records the
expected destination and is exposed in the data layer; the Google Tag in GTM
must use the same ID. Changing the GA4 destination also requires changing that
GTM tag, rather than assuming the browser config overwrites external settings.
Cloudflare manages its Web Analytics beacon in the dashboard.

Production hosts only receive Google tracking. Preview, staging, `/testing` and
HTML marked `noindex` are excluded. Set `data-pair-id`, `data-topic-cluster` and
`data-template-type` on each generated page's `<html>` element. Set `lang="en"`
or `lang="es"`. `head.js` makes these context values available before GTM loads.
GA4 has event-scoped definitions for `language`, `pair_id`, `topic_cluster` and
`template_type`.

Use `DDAnalytics.track(eventName, controlledIdentifiers)` for implemented hub
interactions. The allowed parameter list excludes emails, tokens, free text and
full URLs. For links, use the matching `data-analytics-event` and identifier
attributes. The waitlist emits `generate_lead` only after a successful server
response and records controlled error categories on failure.

## Hub release links

The target is six distinct contextual incoming and outgoing same-language
links per published hub page. Language switchers and global navigation/footer
links do not count. The revised planning CSV satisfies the planned graph,
including cumulative phase 1 and phase 2 releases. Small publication batches
must pass their own rendered graph check; planned future URLs cannot satisfy it.

After building real hub pages, supply a published-page manifest and run:

```sh
python3 scripts/check-hub-links.py dist content/published-hub-manifest.json
```

The manifest contains `page_path`, `language` and `published: true` only for
pages actually included in the release, plus `pair_id`, `topic_cluster` and
`template_type`. When this manifest exists, the build copies each published
page's actual HTML, fills its analytics attributes, injects the shared scripts
and automatically runs the six-link check. It stops the release if links fail.
Source HTML must already have the correct language. The check reads rendered `<main>`
anchors, ignores global nav/footer, requires self-canonicals and rejects
noindex/nofollow pages. Follow it with a production HTTP crawl and GSC checks.
The current three-page coming-soon site cannot meet a six-link hub minimum;
do not represent this planning target as a current live-link score.

## Verification commands

```sh
node scripts/build.mjs
node scripts/test-site-config.mjs
node scripts/test-waitlist.mjs
python3 scripts/test-hub-links.py
python3 scripts/test-hub-build.py
```

Hub quality remains gated by original useful content, appropriate expert review,
paired-language QA, schema validation, accessibility, field performance and
measurement. A sitemap or configuration file alone does not establish 10/10.
