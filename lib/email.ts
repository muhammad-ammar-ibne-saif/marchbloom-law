import { Resend } from "resend";
import { LeadInput } from "./leads";

function formatGBP(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(amount);
}

function buildEmailHtml(lead: LeadInput): string {
  const rows: [string, string][] = [
    ["Name", `${lead.firstName} ${lead.lastName}`],
    ["Email", lead.email],
    ["Phone", lead.phone],
    ["Transaction", lead.transactionType],
  ];

  if (lead.propertyValue) {
    rows.push(["Property value", formatGBP(lead.propertyValue)]);
    rows.push(["Tenure", lead.isLeasehold ? "Leasehold" : "Freehold"]);
  }
  if (lead.estimate) {
    rows.push(["Estimated total", formatGBP(lead.estimate.total)]);
  }
  if (lead.message) {
    rows.push(["Message", lead.message]);
  }

  const rowsHtml = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px;color:#5c6b62;font-size:13px;">${label}</td><td style="padding:6px 12px;font-weight:600;color:#16261f;font-size:13px;">${value}</td></tr>`
    )
    .join("");

  return `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
      <h2 style="color:#16261f;">New quote enquiry</h2>
      <table style="width:100%;border-collapse:collapse;">${rowsHtml}</table>
    </div>
  `;
}

/**
 * Sends an internal notification email when a new lead comes in. Designed
 * to fail gracefully: if RESEND_API_KEY isn't configured, it logs a warning
 * instead of throwing, so a misconfigured env var never blocks the lead
 * from being saved to the database.
 */
export async function sendLeadNotificationEmail(lead: LeadInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFICATION_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    console.warn(
      "[email] RESEND_API_KEY, LEAD_NOTIFICATION_EMAIL, or RESEND_FROM_EMAIL not set — skipping notification email."
    );
    return;
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to,
      replyTo: lead.email,
      subject: `New enquiry — ${lead.firstName} ${lead.lastName} (${lead.transactionType})`,
      html: buildEmailHtml(lead), 
    });
  } catch (err) {
    // Never let an email failure prevent the lead from being recorded.
    console.error("[email] Failed to send lead notification:", err);
  }
}
