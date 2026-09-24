import { json } from "../_lib/respond.js";
import { sendEmail } from "../_lib/resend.js";
import { renderEmailHtml, renderEmailText } from "../_lib/email-render.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LEN = 5000;

function field(data, key) {
  return String(data[key] == null ? "" : data[key]).trim().slice(0, MAX_LEN);
}

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.RESEND_API_KEY) {
    return json(500, { error: "Mail is not configured" });
  }

  let data;
  try {
    data = await request.json();
  } catch (err) {
    return json(400, { error: "Invalid JSON payload" });
  }

  if (!data || typeof data !== "object") {
    return json(400, { error: "Invalid JSON payload" });
  }

  if (data.botcheck) {
    return json(200, { success: true });
  }

  const name = field(data, "name");
  const company = field(data, "company");
  const email = field(data, "email");
  const phone = field(data, "phone");
  const message = field(data, "message");

  if (!name || !email || !message) {
    return json(400, { error: "Required fields are missing" });
  }

  if (!EMAIL_RE.test(email)) {
    return json(400, { error: "Invalid email address" });
  }

  const subject = company
    ? `Consultation request: ${name} (${company})`
    : `Consultation request: ${name}`;

  const rows = [
    ["Name", name],
    ["Company", company || "—"],
    ["Work email", email],
    ["Phone", phone || "—"],
  ];

  const submittedAt = new Date().toLocaleString("en-CA", {
    timeZone: "America/Vancouver",
    dateStyle: "full",
    timeStyle: "short",
  });

  const emailOpts = {
    badgeLabel: "Consultation",
    title: "New consultation request",
    subtitle: "Someone booked a consultation through the BadgerByte website.",
    rows,
    messageHeading: "What they'd like to discuss",
    messageBody: message,
    replyTo: email,
    submittedAt,
  };

  const html = renderEmailHtml(emailOpts);
  const text = renderEmailText(emailOpts);

  try {
    await sendEmail(env, {
      to: "admin@badgerbytesoftware.com",
      from: "BadgerByte Website <webmailer@badgerbytesoftware.com>",
      replyTo: email,
      subject,
      text,
      html,
    });
    return json(200, { success: true });
  } catch (err) {
    console.error("Contact endpoint send error:", err);
    return json(500, { error: "Failed to send" });
  }
}

export async function onRequest(context) {
  if (context.request.method !== "POST") {
    return json(405, { error: "Method not allowed" });
  }
  return onRequestPost(context);
}
