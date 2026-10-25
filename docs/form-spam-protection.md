# Form spam protection

## Implemented baseline

Both `ContactForm` (`zJR7lYKAh`) and `NewsletterForm` (`buMSWec82`) render a CSS-hidden `_honeypot` text input, excluded from tab order and the accessibility tree, with autocomplete disabled. Both handlers pass its value into a shared JSON submission helper. A populated trap is rejected locally without contacting Formspark; the reserved field is also included in legitimate requests so Formspark can apply its built-in server-side check.

The handlers keep separate endpoints and analytics. Contact submissions do not trigger newsletter requests. Names, numeric messages, all-interest selections, quick completion, and email domains are not used as rejection rules. Those would risk rejecting legitimate visitors.

Repeated events during an in-flight request are ignored. HTTP 403 becomes a rejection with an email fallback. Other unsuccessful responses, network failures, and a 15-second timeout show a retry message. Form contents remain available on errors; only confirmed successful contact requests clear the message and fire success analytics. A timeout cannot prove that the provider did not receive the request, so the UI says delivery was not confirmed.

## Important limitation

This is a low-friction baseline, not strong bot verification. A sender posting directly to the public Formspark endpoints can omit the honeypot. Modern browser bots can also skip hidden inputs. Client-side duplicate prevention is not server-side rate limiting.

## Provider settings — not inspected or changed

On October 24, 2026 the Formspark dashboard redirected this browser to sign-in. Current configuration, delivery integrations, existing spam decisions, and newsletter confirmation behavior remain unverified. No live submissions were sent and no suspicious sender was independently identified as a bot.

After account access is available, inspect **both** forms under Settings → Spam protection:

1. Verify **Automatic filter → Screen submissions for spam** is enabled. Formspark documents it as on for new forms, but that does not establish the state of these existing forms.
2. Review **Submissions → Spam** and the reason on the Spam tag. Rejected submissions are retained for up to 30 days and can be marked non-spam.
3. Review **Allowed domains**. Propose `quietloudlab.com` after verifying all production/custom/preview hostnames. The repository CNAME is `quietloudlab.com`; add other hostnames only if the forms are intentionally served there. This is an extra filter, not authentication; don't restrict domains without checking legitimate hosts.
4. For stronger protection, use **Turnstile** (or Botpoison). Recommended next stage: create a Cloudflare Turnstile widget restricted to verified production hostnames, integrate its public site key into **both** form UIs, send a fresh token as `cf-turnstile-response`, and configure **Challenge → Provider → Turnstile** plus its secret key in both Formspark forms. Keep the secret out of this repository and browser bundle. Implement loading/error/expiry/reset/retry handling and test with Cloudflare test keys before switching either production endpoint to require tokens. Enabling the challenge before frontend deployment would reject legitimate submissions.
5. Inspect the actual Dispatch delivery integration and whether it provides double opt-in. The website alone does not establish whether ownership of an address is verified. Do not delete subscribers based on these patterns alone.

Provider/account creation, any terms or spending, production filter changes, and challenge activation require the owner's authorization. No provider setting has been changed by this PR. Built-in `_honeypot` requires no dashboard activation or secret.

## Validation

- `node --test tests/formSubmission.test.mjs`: mocked transport tests for both payload types, clean honeypots, populated traps (including whitespace and `0`), HTTP 403, HTTP 400/429/500, network/timeout exceptions, and successful retry.
- `npm run build`: TypeScript and production bundle.
- These checks do not prove live Formspark rejection or delivery. After merge/deployment and provider access, use clearly labeled owner-controlled test addresses for each live form; verify receipt once, no duplicate subscription, a honeypot-filled request's rejection, preservation/retry after error, keyboard navigation, and the email fallback. If enabling a challenge, also verify missing/invalid/expired tokens are rejected server-side and valid tokens succeed. Check Spam for false positives during the first week.

## Primary reference

https://documentation.formspark.io/setup/spam-protection.html (reviewed October 24, 2026). Documents built-in `_honeypot` / `_gotcha`, automatic filtering, allowed domains, custom spam words, Botpoison, Turnstile, hCaptcha, reCAPTCHA, and HTTP 403 for rejected AJAX submissions. Custom spam words match substrings and are not recommended here without specific evidence.
