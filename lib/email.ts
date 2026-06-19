import { Resend } from "resend";
import { LeadInput } from "./leads";

function formatGBP(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(amount);
}

const transactionLabels: Record<string, string> = {
  purchase: "Purchase",
  sale: "Sale",
  "sale-purchase": "Sale & Purchase",
  remortgage: "Remortgage",
  "transfer-of-equity": "Transfer of Equity",
};

function buildEmailHtml(lead: LeadInput): string {
  const leaseholdLabel = (isLeasehold: boolean, leaseholdType: string | null) =>
    !isLeasehold ? "Freehold"
    : leaseholdType === "high-rise" ? "Leasehold — 5+ floors (BSA, £350)"
    : "Leasehold — under 5 floors (£300)";

  const rows: [string, string][] = [
    ["Name", `${lead.firstName} ${lead.lastName}`],
    ["Email", lead.email],
    ["Phone", lead.phone],
    ["Transaction", transactionLabels[lead.transactionType] ?? lead.transactionType],
  ];

  // Sale & Purchase: show each section separately
  if (lead.transactionType === "sale-purchase") {
    if (lead.saleSection) {
      rows.push(["— SALE —", ""]);
      if (lead.saleSection.transactionAddress)
        rows.push(["Sale Address", lead.saleSection.transactionAddress]);
      if (lead.saleSection.propertyValue)
        rows.push(["Sale Value", formatGBP(lead.saleSection.propertyValue)]);
      rows.push(["Sale Tenure", leaseholdLabel(lead.saleSection.isLeasehold, lead.saleSection.leaseholdType)]);
      rows.push(["Sale People", String(lead.saleSection.peopleInvolved)]);
      if (lead.saleSection.additionalOptions.length)
        rows.push(["Sale Options", lead.saleSection.additionalOptions.join(", ")]);
    }
    if (lead.purchaseSection) {
      rows.push(["— PURCHASE —", ""]);
      if (lead.purchaseSection.transactionAddress)
        rows.push(["Purchase Address", lead.purchaseSection.transactionAddress]);
      if (lead.purchaseSection.propertyValue)
        rows.push(["Purchase Value", formatGBP(lead.purchaseSection.propertyValue)]);
      rows.push(["Purchase Tenure", leaseholdLabel(lead.purchaseSection.isLeasehold, lead.purchaseSection.leaseholdType)]);
      rows.push(["Purchase People", String(lead.purchaseSection.peopleInvolved)]);
      if (lead.hasMortgage !== null && lead.hasMortgage !== undefined)
        rows.push(["Mortgage", lead.hasMortgage ? "Yes" : "No"]);
      if (lead.purchaseSection.additionalOptions.length)
        rows.push(["Purchase Options", lead.purchaseSection.additionalOptions.join(", ")]);
    }
  } else {
    // All other types
    if (lead.transactionAddress)
      rows.push(["Property Address", lead.transactionAddress]);
    if (lead.propertyValue)
      rows.push(["Property Value", formatGBP(lead.propertyValue)]);
    if (lead.remortgageValue)
      rows.push(["Remortgage Value", formatGBP(lead.remortgageValue)]);
    rows.push(["Tenure", leaseholdLabel(lead.isLeasehold, lead.leaseholdType)]);
    if (lead.hasMortgage !== null && lead.hasMortgage !== undefined)
      rows.push(["Mortgage", lead.hasMortgage ? "Yes" : "No"]);
    if (lead.peopleInvolved)
      rows.push(["People Involved", String(lead.peopleInvolved)]);
    if (lead.peopleBeingAdded !== null && lead.peopleBeingAdded !== undefined)
      rows.push(["People Being Added", String(lead.peopleBeingAdded)]);
    if (lead.peopleBeingRemoved !== null && lead.peopleBeingRemoved !== undefined)
      rows.push(["People Being Removed", String(lead.peopleBeingRemoved)]);
    if (lead.additionalOptions?.length)
      rows.push(["Additional Options", lead.additionalOptions.join(", ")]);
  }

  if (lead.estimate)
    rows.push(["Estimated Total", formatGBP(lead.estimate.total)]);
  if (lead.message)
    rows.push(["Message", lead.message]);

  const rowsHtml = rows
    .map(([label, value]) =>
      value === ""
        ? `<tr><td colspan="2" style="padding:8px 12px 4px;font-size:11px;font-weight:700;letter-spacing:0.08em;color:#9bb5a4;text-transform:uppercase;">${label}</td></tr>`
        : `<tr><td style="padding:6px 12px;color:#5c6b62;font-size:13px;white-space:nowrap;">${label}</td><td style="padding:6px 12px;font-weight:600;color:#16261f;font-size:13px;">${value}</td></tr>`
    )
    .join("");

  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
      <h2 style="color:#16261f;">New quote enquiry</h2>
      <table style="width:100%;border-collapse:collapse;">${rowsHtml}</table>
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