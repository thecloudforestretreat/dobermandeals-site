const HOSTS = new Set(["dobermandeals.com", "www.dobermandeals.com", "staging.dobermandeals.com"]);
function reply(status, message) {
  return Response.json({ ok: status === 200, message }, { status, headers: { "Cache-Control": "no-store" } });
}
export async function onRequestPost({ request, env }) {
  const url = new URL(request.url);
  if (!HOSTS.has(url.hostname) || request.headers.get("Origin") !== url.origin) return reply(403, "Please submit from our website.");
  if (!env.TURNSTILE_SECRET_KEY || !env.WAITLIST) return reply(503, "Signups are temporarily unavailable. Please try again later.");
  if (Number(request.headers.get("Content-Length")) > 4096) return reply(413, "Submission too large.");
  let data;
  try {
    const raw = await request.text();
    if (raw.length > 4096) return reply(413, "Submission too large.");
    data = JSON.parse(raw);
  } catch { return reply(400, "Invalid submission."); }
  if (!data || typeof data !== "object" || Array.isArray(data)) return reply(400, "Invalid submission.");
  if (data.language !== undefined && !["en", "es"].includes(data.language)) return reply(400, "Invalid submission.");
  const email = typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || data.consent !== true) return reply(400, "Enter a valid email and agree to launch updates.");
  if (typeof data.token !== "string" || !data.token || data.token.length > 2048) return reply(400, "Complete the security check.");
  try {
    const check = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: data.token }),
      signal: AbortSignal.timeout(10000)
    });
    if (!check.ok) return reply(503, "Security verification is unavailable. Please try again.");
    const verified = await check.json();
    if (!verified.success || verified.hostname !== url.hostname || verified.action !== "waitlist") return reply(400, "Security check expired. Please try again.");
    const hash = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(email))), b => b.toString(16).padStart(2, "0")).join("");
    const prefix = url.hostname === "staging.dobermandeals.com" ? "staging:" : "signup:";
    await env.WAITLIST.put(prefix + hash, JSON.stringify({ email, language: data.language || "en", consent: true, consentVersion: "launch-updates-2026-10-12", submittedAt: new Date().toISOString() }), prefix === "staging:" ? { expirationTtl: 86400 } : {});
    return reply(200, "Thanks. You are on the list.");
  } catch { return reply(503, "We could not save your signup. Please try again later."); }
}
export function onRequestGet() { return reply(405, "Please use the signup form."); }
