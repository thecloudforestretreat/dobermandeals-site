Contact notification connection, prepared for approval

Recipient: dobermandeals3@gmail.com only.
Sender: contact-notifications@dobermandeals.com.
Private service Worker: dobermandeals-contact-notifier; workers.dev and preview URLs disabled.
Binding: CONTACT_EMAIL restricted to the verified destination.
Pages preview service binding: CONTACT_NOTIFIER to this Worker.

Activation: verify destination using the Cloudflare email in the Doberman Gmail inbox, onboard dobermandeals.com email routing without replacing existing mail records, deploy the private Worker, bind it to Pages preview, and connect the contact handler after durable storage. Test actual inbox delivery in both languages. Keep production unchanged until its release.

Prepared source is not deployed or connected. Never report delivery complete until a test message is visible in Gmail. No Gmail read/send OAuth access is required. The visitor email, message, category and language will be delivered to the owner inbox; no visitor data goes into analytics.
