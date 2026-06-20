import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown> & { honeypot?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (body.honeypot) return NextResponse.json({ ok: true });

  const { name, email, phone, subject, message } = body;
  if (!name || !email || !phone || !message) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }
  if (!isValidEmail(String(email))) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFICATION_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    console.warn("[contact] Missing email env vars — message not sent.");
    return NextResponse.json({ error: "Contact form is not configured." }, { status: 500 });
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to,
      replyTo: String(email),
      subject: `New website enquiry${subject ? ` — ${subject}` : ""} (from ${name})`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
          <h2 style="color:#16261f;">New contact form message</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:6px 12px;color:#5c6b62;font-size:13px;">Name</td><td style="padding:6px 12px;font-weight:600;color:#16261f;font-size:13px;">${name}</td></tr>
            <tr><td style="padding:6px 12px;color:#5c6b62;font-size:13px;">Email</td><td style="padding:6px 12px;font-weight:600;color:#16261f;font-size:13px;">${email}</td></tr>
            <tr><td style="padding:6px 12px;color:#5c6b62;font-size:13px;">Phone</td><td style="padding:6px 12px;font-weight:600;color:#16261f;font-size:13px;">${phone}</td></tr>
            ${subject ? `<tr><td style="padding:6px 12px;color:#5c6b62;font-size:13px;">Subject</td><td style="padding:6px 12px;font-weight:600;color:#16261f;font-size:13px;">${subject}</td></tr>` : ""}
            <tr><td style="padding:6px 12px;color:#5c6b62;font-size:13px;vertical-align:top;">Message</td><td style="padding:6px 12px;font-weight:600;color:#16261f;font-size:13px;">${String(message).replace(/\n/g, "<br/>")}</td></tr>
          </table>
        </div>
      `,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Failed to send message:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}