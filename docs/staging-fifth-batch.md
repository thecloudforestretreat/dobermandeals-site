# Priority 1 completion batch

Three additional bilingual pairs (six pages): DD-016 subscription box, DD-059 suspected bloat/GDV emergency action, DD-129 launch-update signup. Cumulative scope 116/116 Priority 1 URLs; 116/260 total URLs. Built on staging; editorial, veterinary and Spanish approval is separate and remains pending.

No product contents, price, launch date, shipping promise, reservation or paid order is invented. New signup uses the existing server-validated Turnstile/KV flow, captures EN/ES preference and consent, and confirms success only after persistence. Browser messages are localized; busy status and reset behavior remain accessible. Staging KV entries expire after 24 hours. /subscribe/ redirects to the new English signup route in this staging branch.

Emergency content starts with immediate professional-care guidance, has no decorative hero image, labels its checklist as advance preparation and excludes commercial recommendations from main-content related links. Clinical checklist and action diagram await veterinary signoff.

Server checks cover invalid data/origin/language/consent/token, Turnstile hostname/action failures, storage failure, EN/ES persistence, staging isolation and verification outages. Central-config and build integration checks pass.

Live verification: the existing managed widget now explicitly authorizes staging.dobermandeals.com alongside dobermandeals.com. Real EN and ES signups using reserved example.com test addresses received server-confirmed saves, with localized confirmations and cleared form/busy state. No challenge was manually solved.
