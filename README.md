# BadgerByte Software — Website

Marketing site for [BadgerByte Software](https://badgerbytesoftware.com) — custom software,
technical consultancy and AI implementation for brokerages, agencies and insurance
businesses across British Columbia.

## Structure

A single static page with no build step:

```
index.html     # the whole site (markup, inline CSS and JS)
assets/        # logo, client logos and tech icons
```

## Running locally

Open `index.html` directly in a browser, or serve it:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000.
