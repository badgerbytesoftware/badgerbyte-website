export function escapeHtml(v) {
  return String(v == null ? "" : v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Site palette (matches index.html)
const INK = "#111113";
const PAPER = "#F7F7F5";
const LINE = "#EEEEEA";
const MUTED = "#5B5D63";
const SUBTLE = "#8E9097";
const ACCENT = "#4F5BD5";
const ACCENT_SOFT = "#A9AEF0";
const ACCENT_TINT = "#F6F6FD";
const ACCENT_LINE = "#E3E5F8";

const SANS = "'Geist', ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const MONO = "'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

/**
 * Renders HTML email for form submissions using email-client-safe table layouts,
 * styled after the BadgerByte site: dark ink header, warm paper background,
 * Geist type with mono eyebrows and a periwinkle accent.
 *
 * @param {Object} opts
 * @param {string} opts.badgeLabel - E.g. "Consultation Request"
 * @param {string} opts.title - Main heading, e.g. "New consultation request"
 * @param {string} [opts.subtitle] - Optional subtitle under heading
 * @param {Array<[string, string]>} opts.rows - Label and value pairs for submission data
 * @param {string} [opts.messageHeading] - Label for message box (e.g. "What they'd like to discuss")
 * @param {string} [opts.messageBody] - Text content for message box
 * @param {string} [opts.replyTo] - Email address used for the "Reply" button
 * @param {string} [opts.submittedAt] - Formatted timestamp string
 */
export function renderEmailHtml(opts) {
  const {
    badgeLabel = "Notification",
    title = "New form submission",
    subtitle = "A new form submission was received from the BadgerByte website.",
    rows = [],
    messageHeading,
    messageBody,
    replyTo,
    submittedAt,
  } = opts;

  let rowsHtml = "";
  for (const [label, val] of rows) {
    rowsHtml += `
      <tr>
        <td style="padding: 11px 12px 11px 0; font-family: ${MONO}; font-size: 11px; letter-spacing: 0.04em; text-transform: uppercase; color: ${SUBTLE}; border-bottom: 1px solid ${LINE}; width: 120px; white-space: nowrap; vertical-align: top;">
          ${escapeHtml(label)}
        </td>
        <td style="padding: 10px 0; font-size: 15px; font-weight: 500; color: ${INK}; border-bottom: 1px solid ${LINE}; word-break: break-word;">
          ${escapeHtml(val || "—")}
        </td>
      </tr>`;
  }

  let messageHtml = "";
  if (messageHeading && messageBody) {
    const formattedBody = escapeHtml(messageBody).replace(/\n/g, "<br>");
    messageHtml = `
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 24px 0;">
        <tr>
          <td style="background-color: ${ACCENT_TINT}; border: 1px solid ${ACCENT_LINE}; border-radius: 10px; padding: 16px 18px;">
            <div style="font-family: ${MONO}; font-size: 11px; color: ${ACCENT}; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 8px;">
              ${escapeHtml(messageHeading)}
            </div>
            <div style="font-size: 15px; color: ${INK}; line-height: 1.6;">
              ${formattedBody}
            </div>
          </td>
        </tr>
      </table>`;
  }

  let replyHtml = "";
  if (replyTo) {
    replyHtml = `
      <table border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 8px 0;">
        <tr>
          <td style="background-color: ${INK}; border-radius: 10px;">
            <a href="mailto:${escapeHtml(replyTo)}" style="display: inline-block; padding: 12px 20px; font-family: ${SANS}; font-size: 14px; font-weight: 500; color: #FFFFFF; text-decoration: none;">Reply to ${escapeHtml(replyTo)}</a>
          </td>
        </tr>
      </table>`;
  }

  let timestampHtml = "";
  if (submittedAt) {
    timestampHtml = `
      <p style="margin: 16px 0 0 0; font-family: ${MONO}; font-size: 11px; letter-spacing: 0.02em; color: ${SUBTLE};">
        Submitted ${escapeHtml(submittedAt)}
      </p>`;
  }

  return `<!doctype html>
<html lang="en-CA">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light" />
    <title>${escapeHtml(title)}</title>
    <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&amp;family=Geist+Mono:wght@400;500&amp;display=swap" rel="stylesheet" />
  </head>
  <body style="margin: 0; padding: 0; background-color: ${PAPER}; font-family: ${SANS}; color: ${INK}; -webkit-font-smoothing: antialiased;">
    <!-- Outer wrapper table -->
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: ${PAPER}; padding: 32px 12px;">
      <tr>
        <td align="center">
          <!-- Main Card Container (600px max) -->
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid ${LINE};">
            <!-- Header Banner -->
            <tr>
              <td style="background-color: ${INK}; padding: 22px 28px;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="vertical-align: middle;">
                      <span style="font-size: 17px; font-weight: 600; color: #FFFFFF; letter-spacing: -0.02em;">BadgerByte Software</span>
                    </td>
                    <td align="right" style="vertical-align: middle;">
                      <span style="display: inline-block; font-family: ${MONO}; font-size: 11px; color: ${ACCENT_SOFT}; letter-spacing: 0.04em; text-transform: uppercase; padding: 5px 10px; border: 1px solid #2C2C31; border-radius: 20px; background-color: #1B1B1E;">${escapeHtml(badgeLabel)}</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Content Body -->
            <tr>
              <td style="padding: 32px 28px 28px;">
                <div style="font-family: ${MONO}; font-size: 12px; color: ${ACCENT}; letter-spacing: 0.02em; margin-bottom: 10px;">Website enquiry</div>
                <h1 style="margin: 0 0 8px 0; font-size: 26px; line-height: 1.15; font-weight: 500; letter-spacing: -0.03em; color: ${INK};">
                  ${escapeHtml(title)}
                </h1>
                ${subtitle ? `<p style="margin: 0 0 24px 0; font-size: 15px; color: ${MUTED}; line-height: 1.6;">${escapeHtml(subtitle)}</p>` : ""}

                <!-- Submission Data Table -->
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; margin-bottom: 24px; border-top: 1px solid ${LINE};">
                  ${rowsHtml}
                </table>

                ${messageHtml}
                ${replyHtml}
                ${timestampHtml}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: ${PAPER}; padding: 18px 28px; border-top: 1px solid ${LINE};">
                <p style="margin: 0; font-size: 12px; color: ${SUBTLE}; line-height: 1.6;">
                  Sent from the contact form at badgerbytesoftware.com<br />
                  © 2026 BadgerByte Software · British Columbia, Canada
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function renderEmailText(opts) {
  const {
    title = "New form submission",
    rows = [],
    messageHeading,
    messageBody,
    submittedAt,
  } = typeof opts === "object" && !Array.isArray(opts) ? opts : {};

  let text = `${title.toUpperCase()}\n\n`;
  text += rows.map(([label, val]) => `${label}: ${val || "—"}`).join("\n");

  if (messageHeading && messageBody) {
    text += `\n\n${messageHeading}:\n${messageBody}`;
  }

  if (submittedAt) {
    text += `\n\nSubmitted: ${submittedAt}`;
  }

  return text;
}
