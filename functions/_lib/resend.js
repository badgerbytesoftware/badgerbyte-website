export async function sendEmail(
  env,
  { to, from, replyTo, subject, text, html, attachments },
) {
  if (!env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const payload = {
    from: from || "BadgerByte Website <webmailer@badgerbytesoftware.com>",
    to: Array.isArray(to) ? to : [to],
    subject: subject,
    text: text,
    html: html,
  };

  if (replyTo) {
    payload.reply_to = replyTo;
  }

  if (attachments && attachments.length > 0) {
    payload.attachments = attachments;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + env.RESEND_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Resend API error:", res.status, errorText);
    throw new Error("Failed to send email via Resend");
  }

  return await res.json();
}
