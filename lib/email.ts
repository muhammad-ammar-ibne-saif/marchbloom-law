import { Resend } from "resend";
import { LeadInput } from "./leads";
import { DetailedBreakdown, formatGBP } from "./pricing";

const transactionLabels: Record<string, string> = {
  purchase: "Purchase",
  sale: "Sale",
  "sale-purchase": "Sale & Purchase",
  remortgage: "Remortgage",
  "transfer-of-equity": "Transfer of Equity",
};

function leaseholdLabel(isLeasehold: boolean, leaseholdType: string | null) {
  return !isLeasehold
    ? "Freehold"
    : leaseholdType === "high-rise"
    ? "Leasehold — 5+ floors (BSA, £350)"
    : "Leasehold — under 5 floors (£300)";
}

function row(label: string, value: string, bold = false): string {
  return `<tr><td style="padding:6px 12px;color:#5c6b62;font-size:13px;">${label}</td><td style="padding:6px 12px;font-weight:${bold ? 700 : 600};color:#16261f;font-size:13px;">${value}</td></tr>`;
}

function breakdownRows(label: string, b: DetailedBreakdown): string {
  const lines: string[] = [
    `<tr><td colspan="2" style="padding:10px 12px 4px;font-size:11px;font-weight:700;letter-spacing:0.08em;color:#9bb5a4;text-transform:uppercase;">${label}</td></tr>`,
    row("Legal Fees", formatGBP(b.legalFee)),
    row("Legal Fees VAT at 20%", formatGBP(b.legalFeeVat)),
  ];
  if (b.supplements.length > 0) {
    for (const s of b.supplements) lines.push(row(s.label, formatGBP(s.amount)));
    lines.push(row("VAT at 20%", formatGBP(b.supplementsVat)));
  }
  for (const d of b.disbursements) lines.push(row(d.label, formatGBP(d.amount)));
  if (b.sdlt !== null && b.sdlt > 0) lines.push(row("Stamp Duty Land Tax (estimated)", formatGBP(b.sdlt)));
  lines.push(row(`${label} — Total, including VAT and disbursements`, formatGBP(b.subtotal), true));
  if (b.unpricedOptions.length) lines.push(row("Also selected", b.unpricedOptions.join(", ")));
  return lines.join("");
}

function buildEmailHtml(lead: LeadInput): string {
  const rows: string[] = [
    row("Name", `${lead.firstName} ${lead.lastName}`),
    row("Email", lead.email),
    row("Phone", lead.phone),
    row("Transaction", transactionLabels[lead.transactionType] ?? lead.transactionType),
  ];

  if (lead.transactionType === "sale-purchase") {
    if (lead.saleSection) {
      rows.push(row("Sale Address", lead.saleSection.transactionAddress || "—"));
      rows.push(row("Sale Value", lead.saleSection.propertyValue ? formatGBP(lead.saleSection.propertyValue) : "—"));
      rows.push(row("Sale Tenure", leaseholdLabel(lead.saleSection.isLeasehold, lead.saleSection.leaseholdType)));
    }
    if (lead.purchaseSection) {
      rows.push(row("Purchase Address", lead.purchaseSection.transactionAddress || "—"));
      rows.push(row("Purchase Value", lead.purchaseSection.propertyValue ? formatGBP(lead.purchaseSection.propertyValue) : "—"));
      rows.push(row("Purchase Tenure", leaseholdLabel(lead.purchaseSection.isLeasehold, lead.purchaseSection.leaseholdType)));
    }
    if (lead.hasMortgage !== null) rows.push(row("Mortgage", lead.hasMortgage ? "Yes" : "No"));
    if (lead.saleBreakdown) rows.push(breakdownRows("Sale Breakdown", lead.saleBreakdown));
    if (lead.purchaseBreakdown) rows.push(breakdownRows("Purchase Breakdown", lead.purchaseBreakdown));
    if (lead.combinedTotal !== null) rows.push(row("Combined Total", formatGBP(lead.combinedTotal), true));
  } else {
    if (lead.transactionAddress) rows.push(row("Property Address", lead.transactionAddress));
    if (lead.propertyValue) rows.push(row("Property Value", formatGBP(lead.propertyValue)));
    if (lead.remortgageValue) rows.push(row("Remortgage Value", formatGBP(lead.remortgageValue)));
    rows.push(row("Tenure", leaseholdLabel(lead.isLeasehold, lead.leaseholdType)));
    if (lead.hasMortgage !== null) rows.push(row("Mortgage", lead.hasMortgage ? "Yes" : "No"));
    if (lead.peopleBeingAdded !== null) rows.push(row("People Being Added", String(lead.peopleBeingAdded)));
    if (lead.peopleBeingRemoved !== null) rows.push(row("People Being Removed", String(lead.peopleBeingRemoved)));
    if (lead.singleBreakdown) rows.push(breakdownRows(transactionLabels[lead.transactionType] ?? "Breakdown", lead.singleBreakdown));
  }

  if (lead.message) rows.push(row("Message", lead.message));

  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
      <h2 style="color:#16261f;">New quote enquiry</h2>
      <table style="width:100%;border-collapse:collapse;">${rows.join("")}</table>
    </div>
  `;
}

export async function sendLeadNotificationEmail(lead: LeadInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFICATION_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    console.warn("[email] Missing env vars — skipping notification email.");
    return;
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to,
      replyTo: lead.email,
      subject: `New enquiry — ${lead.firstName} ${lead.lastName} (${transactionLabels[lead.transactionType] ?? lead.transactionType})`,
      html: buildEmailHtml(lead),
    });
  } catch (err) {
    console.error("[email] Failed to send lead notification:", err);
  }
}