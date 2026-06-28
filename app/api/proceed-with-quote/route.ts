import { NextRequest, NextResponse } from "next/server";
import { createProceedSubmission, ProceedInput } from "@/lib/proceed";
import { getLeadById } from "@/lib/leads";
import { Resend } from "resend";
import { formatGBP, DetailedBreakdown } from "@/lib/pricing";

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function breakdownTable(label: string, b: DetailedBreakdown): string {
  const rows: string[] = [];

  rows.push(`
    <tr><td colspan="2" style="padding:12px 0 4px;font-size:14px;font-weight:700;color:#16261f;">Legal Fees</td></tr>
    <tr>
      <td style="padding:4px 0;font-size:13px;color:#444;border-bottom:1px solid #eee;">Legal Fees</td>
      <td style="padding:4px 0;font-size:13px;color:#444;text-align:right;border-bottom:1px solid #eee;">${formatGBP(b.legalFee)}</td>
    </tr>
    <tr>
      <td style="padding:4px 0;font-size:13px;color:#444;border-bottom:1px solid #eee;">Legal Fees VAT at 20%</td>
      <td style="padding:4px 0;font-size:13px;color:#444;text-align:right;border-bottom:1px solid #eee;">${formatGBP(b.legalFeeVat)}</td>
    </tr>
  `);

  if (b.supplements.length > 0) {
    rows.push(`<tr><td colspan="2" style="padding:12px 0 4px;font-size:14px;font-weight:700;color:#16261f;">Supplements</td></tr>`);
    for (const s of b.supplements) {
      rows.push(`
        <tr>
          <td style="padding:4px 0;font-size:13px;color:#444;border-bottom:1px solid #eee;">${s.label}</td>
          <td style="padding:4px 0;font-size:13px;color:#444;text-align:right;border-bottom:1px solid #eee;">${formatGBP(s.amount)}</td>
        </tr>
      `);
    }
    rows.push(`
      <tr>
        <td style="padding:4px 0;font-size:13px;color:#444;border-bottom:1px solid #eee;">VAT at 20%</td>
        <td style="padding:4px 0;font-size:13px;color:#444;text-align:right;border-bottom:1px solid #eee;">${formatGBP(b.supplementsVat)}</td>
      </tr>
    `);
  }

  if (b.disbursements.length > 0) {
    rows.push(`<tr><td colspan="2" style="padding:12px 0 4px;font-size:14px;font-weight:700;color:#16261f;">Disbursements</td></tr>`);
    for (const d of b.disbursements) {
      rows.push(`
        <tr>
          <td style="padding:4px 0;font-size:13px;color:#444;border-bottom:1px solid #eee;">${d.label}</td>
          <td style="padding:4px 0;font-size:13px;color:#444;text-align:right;border-bottom:1px solid #eee;">${formatGBP(d.amount)}</td>
        </tr>
      `);
    }
  }

  if (b.sdltDeferred) {
    rows.push(`
      <tr>
        <td style="padding:4px 0;font-size:13px;color:#444;border-bottom:1px solid #eee;">Stamp Duty (SDLT)</td>
        <td style="padding:4px 0;font-size:13px;color:#444;text-align:right;border-bottom:1px solid #eee;">Deferred</td>
      </tr>
    `);
  }

  rows.push(`
    <tr>
      <td style="padding:10px 0;font-size:14px;font-weight:700;color:#16261f;border-top:2px solid #16261f;">Total, including VAT and disbursements</td>
      <td style="padding:10px 0;font-size:14px;font-weight:700;color:#16261f;text-align:right;border-top:2px solid #16261f;">${formatGBP(b.subtotal)}</td>
    </tr>
  `);

  return `
    <h3 style="font-size:16px;font-weight:700;color:#16261f;margin:20px 0 8px;">Your ${label} Conveyancing Quote</h3>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      ${rows.join("")}
    </table>
  `;
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { fullName, email, phone, correspondenceAddress } = body;
  if (!fullName || !email || !phone || !correspondenceAddress) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }
  if (!isValidEmail(String(email))) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const input: ProceedInput = {
    leadId: typeof body.leadId === "string" ? body.leadId : null,
    fullName: String(fullName).trim(),
    email: String(email).trim(),
    phone: String(phone).trim(),
    correspondenceAddress: String(correspondenceAddress).trim(),
    additionalPeopleCount: typeof body.additionalPeopleCount === "number" ? body.additionalPeopleCount : 0,
    additionalPeople: Array.isArray(body.additionalPeople) ? body.additionalPeople as any[] : [],
    transactionType: typeof body.transactionType === "string" ? body.transactionType : "",
    transactionAddress: typeof body.transactionAddress === "string" ? body.transactionAddress : "",
    transactionValue: typeof body.transactionValue === "number" ? body.transactionValue : null,
    isLeasehold: Boolean(body.isLeasehold),
    selectedOptions: Array.isArray(body.selectedOptions) ? body.selectedOptions.map(String) : [],
    agentType: body.agentType === "Private" ? "Private" : "Estate Agent",
    agentCompanyName: typeof body.agentCompanyName === "string" ? body.agentCompanyName : "",
    agentContactName: typeof body.agentContactName === "string" ? body.agentContactName : "",
    agentEmail: typeof body.agentEmail === "string" ? body.agentEmail : "",
    agentPhone: typeof body.agentPhone === "string" ? body.agentPhone : "",
  };

  try {
    const submission = await createProceedSubmission(input);

    // Fetch original lead to get the quote breakdown
    let lead = null;
    if (input.leadId) {
      lead = await getLeadById(input.leadId);
    }

    const apiKey = process.env.RESEND_API_KEY;
    const to     = process.env.LEAD_NOTIFICATION_EMAIL;
    const from   = process.env.RESEND_FROM_EMAIL;

    if (apiKey && to && from) {
      const transactionLabels: Record<string, string> = {
        purchase: "Purchase", sale: "Sale", "sale-purchase": "Sale & Purchase",
        remortgage: "Remortgage", "transfer-of-equity": "Transfer of Equity",
      };
      const txLabel = transactionLabels[input.transactionType] ?? input.transactionType;

      // Build quote section from original lead
      let quoteSection = "";
      if (lead) {
        if (lead.transactionType === "sale-purchase") {
          if (lead.saleBreakdown) quoteSection += breakdownTable("Sale", lead.saleBreakdown);
          if (lead.purchaseBreakdown) quoteSection += breakdownTable("Purchase", lead.purchaseBreakdown);
          if (lead.combinedTotal !== null) {
            quoteSection += `
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:16px;">
                <tr>
                  <td style="padding:10px 0;font-size:15px;font-weight:700;color:#16261f;border-top:2px solid #16261f;">Combined Total</td>
                  <td style="padding:10px 0;font-size:15px;font-weight:700;color:#16261f;text-align:right;border-top:2px solid #16261f;">${formatGBP(lead.combinedTotal)}</td>
                </tr>
              </table>
            `;
          }
        } else if (lead.singleBreakdown) {
          quoteSection = breakdownTable(txLabel, lead.singleBreakdown);
        }
      }

      // Additional people HTML
      const additionalPeopleHtml = input.additionalPeople.map((p, i) => `
        <tr><td colspan="2" style="padding:8px 12px 2px;font-size:11px;font-weight:700;color:#9bb5a4;text-transform:uppercase;">Additional Person ${i + 1}</td></tr>
        <tr><td style="padding:4px 12px;color:#5c6b62;font-size:13px;">Name</td><td style="padding:4px 12px;font-weight:600;color:#16261f;font-size:13px;">${p.fullName}</td></tr>
        <tr><td style="padding:4px 12px;color:#5c6b62;font-size:13px;">Email</td><td style="padding:4px 12px;font-weight:600;color:#16261f;font-size:13px;">${p.email}</td></tr>
        <tr><td style="padding:4px 12px;color:#5c6b62;font-size:13px;">Phone</td><td style="padding:4px 12px;font-weight:600;color:#16261f;font-size:13px;">${p.phone}</td></tr>
        <tr><td style="padding:4px 12px;color:#5c6b62;font-size:13px;">Address</td><td style="padding:4px 12px;font-weight:600;color:#16261f;font-size:13px;">${p.correspondenceAddress}</td></tr>
      `).join("");

      const resend = new Resend(apiKey);
      await resend.emails.send({
        from,
        to,
        replyTo: input.email,
        subject: `Client proceeding with quote — ${input.fullName} (${txLabel})`,
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:20px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;">

      <tr>
        <td align="center" style="padding:30px 40px 20px;border-bottom:1px solid #eee;">
          <h1 style="margin:0;font-family:Georgia,serif;font-size:28px;font-weight:700;letter-spacing:2px;color:#16261f;">
            MARCH<span style="color:#b8963e;">&amp;</span>BLOOM
          </h1>
          <p style="margin:4px 0 0;font-size:13px;letter-spacing:4px;color:#16261f;">LAW</p>
          <p style="margin:12px 0 0;font-size:12px;font-weight:700;color:#b8963e;letter-spacing:1px;text-transform:uppercase;">✅ Client Proceeding with Quote</p>
        </td>
      </tr>

      <tr>
        <td style="padding:30px 40px;">

          <p style="margin:0 0 16px;font-size:14px;color:#333;line-height:1.6;">
            <strong>${input.fullName}</strong> has confirmed they wish to proceed with their conveyancing quote.
            Full details are below.
          </p>

          <!-- Reply CTA -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr><td align="center">
              <a href="mailto:${input.email}"
                style="display:inline-block;background:#16261f;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:14px 36px;border-radius:4px;letter-spacing:0.5px;">
                Reply to ${input.fullName.split(" ")[0]}
              </a>
            </td></tr>
          </table>

          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />

          <!-- Client details -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f0;border-radius:6px;margin-bottom:24px;">
            <tr><td style="padding:20px 24px;">
              <h2 style="margin:0 0 12px;font-size:15px;font-weight:700;color:#16261f;">Client Details</h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="padding:4px 0;color:#5c6b62;font-size:13px;width:40%;">Full Name</td><td style="padding:4px 0;font-weight:600;color:#16261f;font-size:13px;">${input.fullName}</td></tr>
                <tr><td style="padding:4px 0;color:#5c6b62;font-size:13px;">Email</td><td style="padding:4px 0;font-weight:600;color:#16261f;font-size:13px;"><a href="mailto:${input.email}" style="color:#16261f;">${input.email}</a></td></tr>
                <tr><td style="padding:4px 0;color:#5c6b62;font-size:13px;">Phone</td><td style="padding:4px 0;font-weight:600;color:#16261f;font-size:13px;"><a href="tel:${input.phone}" style="color:#16261f;">${input.phone}</a></td></tr>
                <tr><td style="padding:4px 0;color:#5c6b62;font-size:13px;">Correspondence Address</td><td style="padding:4px 0;font-weight:600;color:#16261f;font-size:13px;">${input.correspondenceAddress}</td></tr>
              </table>
              ${additionalPeopleHtml ? `<table width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">${additionalPeopleHtml}</table>` : ""}
            </td></tr>
          </table>

          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />

          <!-- Transaction details -->
          <h3 style="font-size:15px;font-weight:700;color:#16261f;margin:0 0 12px;">Transaction Details</h3>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:4px 0;color:#5c6b62;font-size:13px;width:40%;">Transaction Type</td><td style="padding:4px 0;font-weight:600;color:#16261f;font-size:13px;">${txLabel}</td></tr>
            ${input.transactionAddress ? `<tr><td style="padding:4px 0;color:#5c6b62;font-size:13px;">Property Address</td><td style="padding:4px 0;font-weight:600;color:#16261f;font-size:13px;">${input.transactionAddress}</td></tr>` : ""}
            ${input.transactionValue ? `<tr><td style="padding:4px 0;color:#5c6b62;font-size:13px;">Property Value</td><td style="padding:4px 0;font-weight:600;color:#16261f;font-size:13px;">${formatGBP(input.transactionValue)}</td></tr>` : ""}
            <tr><td style="padding:4px 0;color:#5c6b62;font-size:13px;">Tenure</td><td style="padding:4px 0;font-weight:600;color:#16261f;font-size:13px;">${input.isLeasehold ? "Leasehold" : "Freehold"}</td></tr>
            ${input.selectedOptions.length ? `<tr><td style="padding:4px 0;color:#5c6b62;font-size:13px;">Selected Options</td><td style="padding:4px 0;font-weight:600;color:#16261f;font-size:13px;">${input.selectedOptions.join(", ")}</td></tr>` : ""}
          </table>

          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />

          <!-- Agent information -->
          <h3 style="font-size:15px;font-weight:700;color:#16261f;margin:0 0 12px;">Agent Information</h3>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:4px 0;color:#5c6b62;font-size:13px;width:40%;">Agent Type</td><td style="padding:4px 0;font-weight:600;color:#16261f;font-size:13px;">${input.agentType}</td></tr>
            ${input.agentCompanyName ? `<tr><td style="padding:4px 0;color:#5c6b62;font-size:13px;">Company Name</td><td style="padding:4px 0;font-weight:600;color:#16261f;font-size:13px;">${input.agentCompanyName}</td></tr>` : ""}
            <tr><td style="padding:4px 0;color:#5c6b62;font-size:13px;">Contact Name</td><td style="padding:4px 0;font-weight:600;color:#16261f;font-size:13px;">${input.agentContactName}</td></tr>
            <tr><td style="padding:4px 0;color:#5c6b62;font-size:13px;">Agent Email</td><td style="padding:4px 0;font-weight:600;color:#16261f;font-size:13px;"><a href="mailto:${input.agentEmail}" style="color:#16261f;">${input.agentEmail}</a></td></tr>
            <tr><td style="padding:4px 0;color:#5c6b62;font-size:13px;">Agent Phone</td><td style="padding:4px 0;font-weight:600;color:#16261f;font-size:13px;">${input.agentPhone}</td></tr>
          </table>

          ${quoteSection ? `
            <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
            <h3 style="font-size:15px;font-weight:700;color:#16261f;margin:0 0 12px;">Quote Shown to Client</h3>
            ${quoteSection}
          ` : ""}

        </td>
      </tr>

      <tr>
        <td style="padding:24px 40px;border-top:1px solid #eee;background:#f8f8f8;">
          <h2 style="margin:0 0 4px;font-family:Georgia,serif;font-size:20px;font-weight:700;letter-spacing:2px;color:#16261f;">MARCH<span style="color:#b8963e;">&amp;</span>BLOOM</h2>
          <p style="margin:0 0 12px;font-size:10px;letter-spacing:4px;color:#16261f;">LAW</p>
          <p style="margin:0;font-size:11px;color:#888;line-height:1.6;">
            This is an automated notification from the March &amp; Bloom Law website.
            Use the "Reply to ${input.fullName.split(" ")[0]}" button above to contact the client directly.
          </p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>
        `,
      });
    }

    return NextResponse.json({ ok: true, id: submission._id.toString() });
  } catch (err) {
    console.error("[proceed] Failed to save submission:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}