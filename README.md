# BadgerByte Software — Website

Marketing site for [BadgerByte Software](https://badgerbytesoftware.com) — custom software,
technical consultancy and AI implementation for brokerages, agencies and insurance
businesses across British Columbia.

## Structure

A static site with no build step, plus Cloudflare Pages Functions (`/functions`) for form
email delivery via [Resend](https://resend.com):

```
index.html                     # the whole site (markup, inline CSS)
forms.js                       # contact form validation + submit to /api/contact
assets/                        # logo, client logos and tech icons
functions/api/contact.js       # POST /api/contact → emails the enquiry via Resend
functions/_lib/email-render.js # branded HTML + plain-text email template
functions/_lib/resend.js       # thin Resend API client
_headers                       # cache + security headers for Cloudflare Pages
wrangler.json                  # Pages config (output dir, compatibility date)
```

## Local development

```bash
npm install
npm run dev
```

This runs `wrangler pages dev . --port 3000`, serving the site (and the `/functions` API
routes) at http://localhost:3000.

To send real emails locally, create a `.dev.vars` file (git-ignored) containing:

```
RESEND_API_KEY=re_xxxxxxxx
```

Without it the form returns an error and shows the fallback "email us" message.

## Deploying to production

1. In the Cloudflare dashboard, create a new **Pages** project (Workers & Pages → Pages tab →
   Create → Connect to Git) — **not** a Worker. Worker projects default to `wrangler deploy`,
   which doesn't understand static assets and will fail.
2. Connect the `badgerbytesoftware/badgerbyte-website` GitHub repo.
3. Leave the **Build command** blank — this is a static site, no build step needed.
   `wrangler.json` already tells Pages the output directory (`pages_build_output_dir: "."`).
   The `/functions` directory is picked up and deployed automatically.
4. In Settings → Environment variables, add `RESEND_API_KEY` (used by
   `/functions/_lib/resend.js` to send form emails via Resend). Mark it as a secret.
5. Save and deploy.

## Notes

- Contact form submissions are emailed to `leo@badgerbytesoftware.com` and
  `rafid@badgerbytesoftware.com`, with the visitor's address set as reply-to. Change `to` in `functions/api/contact.js` to route
  them elsewhere.
- Outgoing emails are sent `from: webmailer@badgerbytesoftware.com` — the
  `badgerbytesoftware.com` domain must be verified in the Resend account or sends will fail.

## Domains

DNS is managed at GoDaddy (nameservers `domaincontrol.com`):

- `www.badgerbytesoftware.com` is a CNAME to `badgerbyte-website.pages.dev`, and is also added
  under the Pages project's **Custom domains** (that is what issues its SSL certificate).
- The root `badgerbytesoftware.com` uses GoDaddy domain forwarding (301) to `www`, since
  GoDaddy DNS can't point the root domain at Cloudflare Pages. `www` is the canonical address.
