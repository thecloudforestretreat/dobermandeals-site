Contact notification connection, activated on staging

Recipient: dobermandeals3@gmail.com only.
Sender: contact-notifications@dobermandeals.com.
Private service Worker: dobermandeals-contact-notifier; workers.dev and preview URLs disabled.
Binding: CONTACT_EMAIL; the deployed sender code fixes the recipient to the verified Doberman inbox. The Wrangler configuration additionally specifies destination_address for future CLI deployments.
Pages preview service binding: CONTACT_NOTIFIER to this Worker.

Completed: verified destination, activated the explicitly approved MX/SPF/DKIM records, deployed the private Worker, connected Pages preview, and verified English and Spanish inbox receipts. Production site deployment remains unchanged.

Gmail destination verified, root MX/SPF/DKIM activated with explicit approval. Private sender deployed, public workers.dev disabled; Pages preview CONTACT_NOTIFIER binding saved. Backend connection deployed in staging commit 46a7880. English test notification received and opened in Gmail. Spanish test notification received and opened in Gmail, including accented characters and the correct reply address. Never report delivery complete until a test message is visible in Gmail. No Gmail read/send OAuth access is required. The visitor email, message, category and language will be delivered to the owner inbox; no visitor data goes into analytics.
