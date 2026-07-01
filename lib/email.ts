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
    ? "Leasehold — 5+ floors (BSA)"
    : "Leasehold — under 5 floors";
}

function breakdownTable(label: string, b: DetailedBreakdown): string {
  const rows: string[] = [];

  // Legal fees
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

  // Supplements
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

  // Disbursements
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

  // SDLT deferred
  if (b.sdltDeferred) {
    rows.push(`
      <tr>
        <td style="padding:4px 0;font-size:13px;color:#444;border-bottom:1px solid #eee;">Stamp Duty (SDLT)</td>
        <td style="padding:4px 0;font-size:13px;color:#444;text-align:right;border-bottom:1px solid #eee;">Deferred</td>
      </tr>
    `);
  }

  // Total
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

function buildClientEmailHtml(lead: LeadInput): string {
  const txLabel = transactionLabels[lead.transactionType] ?? lead.transactionType;
  const firstName = lead.firstName;

  let txDetails = "";
  if (lead.transactionType === "sale-purchase") {
    if (lead.saleSection) {
      txDetails += `
        <p style="margin:4px 0;font-size:13px;color:#444;"><strong>Sale Address:</strong> ${lead.saleSection.transactionAddress || "—"}</p>
        <p style="margin:4px 0;font-size:13px;color:#444;"><strong>Sale Value:</strong> ${lead.saleSection.propertyValue ? formatGBP(lead.saleSection.propertyValue) : "—"}</p>
        <p style="margin:4px 0;font-size:13px;color:#444;"><strong>Sale Tenure:</strong> ${leaseholdLabel(lead.saleSection.isLeasehold, lead.saleSection.leaseholdType)}</p>
        ${lead.saleSection.additionalOptions.length ? `<p style="margin:4px 0;font-size:13px;color:#444;"><strong>Sale Options:</strong> ${lead.saleSection.additionalOptions.join(", ")}</p>` : ""}
      `;
    }
    if (lead.purchaseSection) {
      txDetails += `
        <p style="margin:4px 0;font-size:13px;color:#444;"><strong>Purchase Address:</strong> ${lead.purchaseSection.transactionAddress || "—"}</p>
        <p style="margin:4px 0;font-size:13px;color:#444;"><strong>Purchase Value:</strong> ${lead.purchaseSection.propertyValue ? formatGBP(lead.purchaseSection.propertyValue) : "—"}</p>
        <p style="margin:4px 0;font-size:13px;color:#444;"><strong>Purchase Tenure:</strong> ${leaseholdLabel(lead.purchaseSection.isLeasehold, lead.purchaseSection.leaseholdType)}</p>
        ${lead.purchaseSection.additionalOptions.length ? `<p style="margin:4px 0;font-size:13px;color:#444;"><strong>Purchase Options:</strong> ${lead.purchaseSection.additionalOptions.join(", ")}</p>` : ""}
      `;
    }
    if (lead.hasMortgage !== null) {
      txDetails += `<p style="margin:4px 0;font-size:13px;color:#444;"><strong>Mortgage:</strong> ${lead.hasMortgage ? "Yes" : "No"}</p>`;
    }
  } else {
    txDetails = `
      <p style="margin:4px 0;font-size:13px;color:#444;"><strong>Transaction Type:</strong> ${txLabel}</p>
      ${lead.transactionAddress ? `<p style="margin:4px 0;font-size:13px;color:#444;"><strong>Address:</strong> ${lead.transactionAddress}</p>` : ""}
      ${lead.propertyValue ? `<p style="margin:4px 0;font-size:13px;color:#444;"><strong>Transaction Value:</strong> ${formatGBP(lead.propertyValue)}</p>` : ""}
      ${lead.peopleInvolved ? `<p style="margin:4px 0;font-size:13px;color:#444;"><strong>Number of People Involved:</strong> ${lead.peopleInvolved}</p>` : ""}
      <p style="margin:4px 0;font-size:13px;color:#444;"><strong>Transaction Tenure:</strong> ${leaseholdLabel(lead.isLeasehold, lead.leaseholdType)}</p>
      ${lead.hasMortgage !== null ? `<p style="margin:4px 0;font-size:13px;color:#444;"><strong>Mortgage:</strong> ${lead.hasMortgage ? "Yes" : "No"}</p>` : ""}
      ${lead.giftedDepositCount ? `<p style="margin:4px 0;font-size:13px;color:#444;"><strong>Gifted Deposits:</strong> ${lead.giftedDepositCount}</p>` : ""}
      ${lead.htbIsaCount ? `<p style="margin:4px 0;font-size:13px;color:#444;"><strong>Help to Buy ISA:</strong> ${lead.htbIsaCount}</p>` : ""}
      ${lead.lifetimeIsaCount ? `<p style="margin:4px 0;font-size:13px;color:#444;"><strong>Lifetime ISA:</strong> ${lead.lifetimeIsaCount}</p>` : ""}
      ${lead.additionalOptions?.length ? `<p style="margin:4px 0;font-size:13px;color:#444;"><strong>Additional Options:</strong> ${lead.additionalOptions.join(", ")}</p>` : ""}
    `;
  }

  let quoteSection = "";
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

  return `
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
        </td>
      </tr>

      <tr>
        <td style="padding:30px 40px;">

          <p style="margin:0 0 16px;font-size:14px;color:#333;">Hi ${firstName}</p>

          <p style="margin:0 0 20px;font-size:14px;color:#333;line-height:1.6;">
            Thank you for generating a ${txLabel} conveyancing quote with March &amp; Bloom Law, via
            <a href="https://marchbloomlaw.com" style="color:#16261f;">www.marchbloomlaw.com</a>.
          </p>

          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8f8;border-radius:6px;margin-bottom:24px;">
            <tr><td style="padding:20px 24px;">
              <h2 style="margin:0 0 12px;font-size:16px;font-weight:700;color:#16261f;">March &amp; Bloom Law In A Nutshell</h2>
              <ul style="margin:0;padding-left:20px;font-size:13px;color:#444;line-height:2;">
                <li>ULTRA-Competitive Fixed Fees</li>
                <li>Locally-Based with No Move No Fee</li>
                <li>Dedicated Solicitor</li>
                <li>Electronic Onboarding</li>
                <li>We work with the majority of UK mortgage lenders</li>
                <li>SRA Regulated &amp; CQS Accredited</li>
              </ul>
            </td></tr>
          </table>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
            <tr><td align="center">
              <a href="https://marchbloomlaw.com/discuss-quote"
                style="display:inline-block;background:#16261f;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:14px 36px;border-radius:4px;letter-spacing:0.5px;">
                Discuss Your Quote
              </a>
            </td></tr>
          </table>
          <p style="margin:0 0 24px;font-size:13px;color:#444;text-align:center;">
            Call our team on <a href="tel:02082554186" style="color:#16261f;font-weight:700;">020 8255 4186</a>, should you have any questions.
          </p>

          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />

          <h3 style="font-size:15px;font-weight:700;color:#16261f;margin:0 0 12px;">Your Transaction Details:</h3>
          ${txDetails}

          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />

          ${quoteSection}

          <p style="margin:20px 0 0;font-size:11px;color:#888;line-height:1.6;">
            Your Quote: The above quotation is based on a straightforward transaction and is based on the information that you have provided.
          </p>

          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />

          <h2 style="font-size:18px;font-weight:700;color:#16261f;margin:0 0 6px;">Start your Conveyancing</h2>
          <p style="margin:0 0 16px;font-size:13px;color:#444;">Click the button below to start your conveyancing</p>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
            <tr><td align="center">
              <a href="https://marchbloomlaw.com/proceed-with-quote"
                style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:14px 36px;border-radius:4px;letter-spacing:0.5px;">
                Proceed With Quote
              </a>
            </td></tr>
          </table>
          <p style="text-align:center;font-size:13px;color:#444;margin:0 0 12px;">OR</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr><td align="center">
              <a href="https://marchbloomlaw.com/discuss-quote"
                style="display:inline-block;background:#16261f;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:14px 36px;border-radius:4px;letter-spacing:0.5px;">
                Discuss Your Quote
              </a>
            </td></tr>
          </table>

          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />

          <h2 style="font-size:18px;font-weight:700;color:#16261f;margin:0 0 16px;">FAQs</h2>

          <h4 style="font-size:13px;font-weight:700;color:#16261f;margin:0 0 6px;">Why is it important to instruct a solicitor as soon as an offer is accepted?</h4>
          <p style="margin:0 0 16px;font-size:13px;color:#444;line-height:1.6;">In most cases, estate agents will not take the property off the market until they have your solicitor's details. As soon as a sale is agreed, you will usually be asked "Who is your conveyancer?" so the transaction can begin without delay. Many transactions fall through in the first few weeks due to delays in instructing your conveyancer, so it's important to be organised and have a suitable law firm ready to act.</p>

          <h4 style="font-size:13px;font-weight:700;color:#16261f;margin:0 0 6px;">When will I receive my conveyancer's contact details?</h4>
          <p style="margin:0 0 16px;font-size:13px;color:#444;line-height:1.6;">Once you confirm you wish to proceed, a member of the March &amp; Bloom Law 'New Quotes Team' will contact you to confirm your details and formally open your file. Your conveyancer's details will then be provided to you so they can be shared with your agent or broker.</p>

          <h4 style="font-size:13px;font-weight:700;color:#16261f;margin:0 0 6px;">I've not confirmed my mortgage yet, can I still proceed?</h4>
          <p style="margin:0 0 16px;font-size:13px;color:#444;line-height:1.6;">Yes. You do not need to have your mortgage in place to instruct a conveyancer once your offer has been accepted. Providing your solicitor's details to the agent demonstrates your intention to proceed with the purchase, avoiding delays and potential fall-throughs.</p>

          <h4 style="font-size:13px;font-weight:700;color:#16261f;margin:0 0 6px;">When are the legal fees paid?</h4>
          <p style="margin:0 0 4px;font-size:13px;color:#444;line-height:1.6;">There are three stages of payment:</p>
          <ol style="margin:0 0 16px;padding-left:20px;font-size:13px;color:#444;line-height:1.8;">
            <li>The Opening Fee — paid when you instruct March &amp; Bloom Law (included within your quote).</li>
            <li>Initial Legal Disbursements — requested by March &amp; Bloom Law in the onboarding phase: £300.00 for purchases, £100.00 for sales or remortgages. These costs are part of your quoted fees and will be deducted from the quote.</li>
            <li>Final balance — payable on completion of your transaction.</li>
          </ol>

          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />

          <h3 style="font-size:15px;font-weight:700;color:#16261f;margin:0 0 8px;">No Move No Fee Policy</h3>
          <p style="margin:0 0 16px;font-size:13px;color:#444;line-height:1.6;">
            March and Bloom Law do not charge you abortive costs should your transaction fall through or be cancelled. Your file is simply placed on hold until you are ready to restart your transaction with a new property to purchase or a new buyer for your sale. Please contact our team using the details below once you are ready to restart your transaction. Please Note: The No Move No Fee Policy does not apply in cases where the transaction does not go through due to a personal change in circumstances forcing you to pull out, or if you wish to change to an alternative property as you have decided you do not wish to continue with the current property purchase, or where you have not secured lending (if required). In such cases, the firm's standard abortive fees will be charged for works carried out.
          </p>

          <h3 style="font-size:15px;font-weight:700;color:#16261f;margin:0 0 8px;">Are there any additional charges?</h3>
          <p style="margin:0 0 16px;font-size:13px;color:#444;line-height:1.6;">
            Your legal fee is based on the standard transaction outlined in your quote and assumes that the information provided at the outset is accurate and complete. The initial fixed legal fee is calculated using the details supplied to us when generating your quote. During the course of the transaction, additional costs may arise if further legal work becomes necessary or if the nature of the transaction changes that we were not aware of at the quote stage. Accepting this estimate does not constitute a fixed-fee agreement. It is therefore important that the information you provide at this stage is accurate and complete, as it forms the basis of your quotation. This is standard practice across any conveyancing firm.
          </p>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
            <tr><td align="center">
              <a href="https://marchbloomlaw.com/proceed-with-quote"
                style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:14px 36px;border-radius:4px;letter-spacing:0.5px;">
                Proceed With Quote
              </a>
            </td></tr>
          </table>

          <p style="text-align:center;font-size:14px;font-weight:700;color:#16261f;margin:24px 0 16px;">We look forward to working closely with you.</p>

        </td>
      </tr>

      <tr>
        <td style="padding:24px 40px;border-top:1px solid #eee;background:#f8f8f8;">
          <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#16261f;">March &amp; Bloom Law</p>
          <p style="margin:0 0 2px;font-size:12px;color:#444;"><a href="tel:02082554186" style="color:#444;text-decoration:none;">020 8255 4186</a></p>
          <p style="margin:0 0 2px;font-size:12px;color:#444;"><a href="tel:07889555265" style="color:#444;text-decoration:none;">078 8955 5265</a></p>
          <p style="margin:0 0 12px;font-size:12px;color:#444;">Office Address: 30 Durham Road, Haynes Park, London, SW20 0TW</p>
          <h2 style="margin:16px 0 4px;font-family:Georgia,serif;font-size:20px;font-weight:700;letter-spacing:2px;color:#16261f;">MARCH<span style="color:#b8963e;">&amp;</span>BLOOM</h2>
          <p style="margin:0 0 16px;font-size:10px;letter-spacing:4px;color:#16261f;">LAW</p>
          <hr style="border:none;border-top:1px solid #ddd;margin:16px 0;" />
          <p style="margin:0 0 8px;font-size:11px;color:#888;font-weight:700;">Cybercrime Alert:</p>
          <p style="margin:0 0 8px;font-size:11px;color:#888;line-height:1.6;">If you receive an email purporting to be from someone at this firm and telling you that we have changed our bank details, it is likely to be from a criminal. Please do not reply to that email — instead ring the person you have been dealing with at the firm to confirm whether the change is genuine. We will NOT accept responsibility if you transfer money into an incorrect bank account.</p>
          <p style="margin:0 0 8px;font-size:11px;color:#888;line-height:1.6;">WARNING — This email and any files transmitted with it are confidential and may also be privileged. If you are not the intended recipient, you should not copy, forward or use any part of it or disclose its contents to any person. If you have received it in error please notify us immediately on <a href="tel:02082554186" style="color:#888;">020 8255 4186</a>. This email and any automatic copies should be deleted after you have contacted the system manager.</p>
          <p style="margin:0;font-size:11px;color:#888;line-height:1.6;">This email is sent from the offices of March &amp; Bloom Law Limited, authorised and regulated by the Solicitors Regulation Authority (SRA ID number 646763) and registered in England and Wales.</p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>
  `;
}

function buildInternalEmailHtml(lead: LeadInput): string {
  const txLabel = transactionLabels[lead.transactionType] ?? lead.transactionType;

  let txDetails = "";
  if (lead.transactionType === "sale-purchase") {
    if (lead.saleSection) {
      txDetails += `
        <p style="margin:4px 0;font-size:13px;color:#444;"><strong>Sale Address:</strong> ${lead.saleSection.transactionAddress || "—"}</p>
        <p style="margin:4px 0;font-size:13px;color:#444;"><strong>Sale Value:</strong> ${lead.saleSection.propertyValue ? formatGBP(lead.saleSection.propertyValue) : "—"}</p>
        <p style="margin:4px 0;font-size:13px;color:#444;"><strong>Sale Tenure:</strong> ${leaseholdLabel(lead.saleSection.isLeasehold, lead.saleSection.leaseholdType)}</p>
        ${lead.saleSection.additionalOptions.length ? `<p style="margin:4px 0;font-size:13px;color:#444;"><strong>Sale Options:</strong> ${lead.saleSection.additionalOptions.join(", ")}</p>` : ""}
      `;
    }
    if (lead.purchaseSection) {
      txDetails += `
        <p style="margin:4px 0;font-size:13px;color:#444;"><strong>Purchase Address:</strong> ${lead.purchaseSection.transactionAddress || "—"}</p>
        <p style="margin:4px 0;font-size:13px;color:#444;"><strong>Purchase Value:</strong> ${lead.purchaseSection.propertyValue ? formatGBP(lead.purchaseSection.propertyValue) : "—"}</p>
        <p style="margin:4px 0;font-size:13px;color:#444;"><strong>Purchase Tenure:</strong> ${leaseholdLabel(lead.purchaseSection.isLeasehold, lead.purchaseSection.leaseholdType)}</p>
        ${lead.purchaseSection.additionalOptions.length ? `<p style="margin:4px 0;font-size:13px;color:#444;"><strong>Purchase Options:</strong> ${lead.purchaseSection.additionalOptions.join(", ")}</p>` : ""}
        ${lead.giftedDepositCount ? `<p style="margin:4px 0;font-size:13px;color:#444;"><strong>Gifted Deposits:</strong> ${lead.giftedDepositCount}</p>` : ""}
        ${lead.htbIsaCount ? `<p style="margin:4px 0;font-size:13px;color:#444;"><strong>Help to Buy ISAs:</strong> ${lead.htbIsaCount}</p>` : ""}
        ${lead.lifetimeIsaCount ? `<p style="margin:4px 0;font-size:13px;color:#444;"><strong>Lifetime ISAs:</strong> ${lead.lifetimeIsaCount}</p>` : ""}
      `;
    }
    if (lead.hasMortgage !== null) {
      txDetails += `<p style="margin:4px 0;font-size:13px;color:#444;"><strong>Mortgage:</strong> ${lead.hasMortgage ? "Yes" : "No"}</p>`;
    }
  } else {
    txDetails = `
      <p style="margin:4px 0;font-size:13px;color:#444;"><strong>Transaction Type:</strong> ${txLabel}</p>
      ${lead.transactionAddress ? `<p style="margin:4px 0;font-size:13px;color:#444;"><strong>Address:</strong> ${lead.transactionAddress}</p>` : ""}
      ${lead.propertyValue ? `<p style="margin:4px 0;font-size:13px;color:#444;"><strong>Property Value:</strong> ${formatGBP(lead.propertyValue)}</p>` : ""}
      ${lead.peopleInvolved ? `<p style="margin:4px 0;font-size:13px;color:#444;"><strong>People Involved:</strong> ${lead.peopleInvolved}</p>` : ""}
      <p style="margin:4px 0;font-size:13px;color:#444;"><strong>Tenure:</strong> ${leaseholdLabel(lead.isLeasehold, lead.leaseholdType)}</p>
      ${lead.hasMortgage !== null ? `<p style="margin:4px 0;font-size:13px;color:#444;"><strong>Mortgage:</strong> ${lead.hasMortgage ? "Yes" : "No"}</p>` : ""}
      ${lead.includeSearchPack !== null && lead.hasMortgage === false ? `<p style="margin:4px 0;font-size:13px;color:#444;"><strong>Search Pack Included:</strong> ${lead.includeSearchPack ? "Yes" : "No"}</p>` : ""}
      ${lead.giftedDepositCount ? `<p style="margin:4px 0;font-size:13px;color:#444;"><strong>Gifted Deposits:</strong> ${lead.giftedDepositCount}</p>` : ""}
      ${lead.htbIsaCount ? `<p style="margin:4px 0;font-size:13px;color:#444;"><strong>Help to Buy ISAs:</strong> ${lead.htbIsaCount}</p>` : ""}
      ${lead.lifetimeIsaCount ? `<p style="margin:4px 0;font-size:13px;color:#444;"><strong>Lifetime ISAs:</strong> ${lead.lifetimeIsaCount}</p>` : ""}
      ${lead.additionalOptions?.length ? `<p style="margin:4px 0;font-size:13px;color:#444;"><strong>Additional Options:</strong> ${lead.additionalOptions.join(", ")}</p>` : ""}
      ${lead.remortgageValue ? `<p style="margin:4px 0;font-size:13px;color:#444;"><strong>Remortgage Value:</strong> ${formatGBP(lead.remortgageValue)}</p>` : ""}
      ${lead.peopleBeingAdded !== null ? `<p style="margin:4px 0;font-size:13px;color:#444;"><strong>People Being Added:</strong> ${lead.peopleBeingAdded}</p>` : ""}
      ${lead.peopleBeingRemoved !== null ? `<p style="margin:4px 0;font-size:13px;color:#444;"><strong>People Being Removed:</strong> ${lead.peopleBeingRemoved}</p>` : ""}
    `;
  }

  let quoteSection = "";
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

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:20px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;">

      <!-- Logo header -->
      <tr>
        <td align="center" style="padding:30px 40px 20px;border-bottom:1px solid #eee;">
          <h1 style="margin:0;font-family:Georgia,serif;font-size:28px;font-weight:700;letter-spacing:2px;color:#16261f;">
            MARCH<span style="color:#b8963e;">&amp;</span>BLOOM
          </h1>
          <p style="margin:4px 0 0;font-size:13px;letter-spacing:4px;color:#16261f;">LAW</p>
          <p style="margin:12px 0 0;font-size:12px;font-weight:700;color:#b8963e;letter-spacing:1px;text-transform:uppercase;">⚡ New Quote Enquiry</p>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:30px 40px;">

          <p style="margin:0 0 16px;font-size:14px;color:#333;line-height:1.6;">
            A new quote has been generated on <strong>marchbloomlaw.com</strong>. Full details are below.
          </p>

          <!-- Client details box -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f0;border-radius:6px;margin-bottom:24px;">
            <tr><td style="padding:20px 24px;">
              <h2 style="margin:0 0 12px;font-size:15px;font-weight:700;color:#16261f;">Client Details</h2>
              <p style="margin:4px 0;font-size:13px;color:#444;"><strong>Name:</strong> ${lead.firstName} ${lead.lastName}</p>
              <p style="margin:4px 0;font-size:13px;color:#444;"><strong>Email:</strong> <a href="mailto:${lead.email}" style="color:#16261f;">${lead.email}</a></p>
              <p style="margin:4px 0;font-size:13px;color:#444;"><strong>Phone:</strong> <a href="tel:${lead.phone}" style="color:#16261f;">${lead.phone}</a></p>
              ${lead.message ? `<p style="margin:8px 0 0;font-size:13px;color:#444;"><strong>Message:</strong> ${lead.message}</p>` : ""}
            </td></tr>
          </table>

          <!-- Reply CTA -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr><td align="center">
              <a href="mailto:${lead.email}"
                style="display:inline-block;background:#16261f;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:14px 36px;border-radius:4px;letter-spacing:0.5px;">
                Reply to ${lead.firstName}
              </a>
            </td></tr>
          </table>

          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />

          <!-- Transaction details -->
          <h3 style="font-size:15px;font-weight:700;color:#16261f;margin:0 0 12px;">Transaction Details</h3>
          ${txDetails}

          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />

          <!-- Quote breakdown -->
          <h3 style="font-size:15px;font-weight:700;color:#16261f;margin:0 0 12px;">Quote Shown to Client</h3>
          ${quoteSection}

          <p style="margin:20px 0 0;font-size:11px;color:#888;line-height:1.6;">
            This quote was generated automatically based on the information provided by the client.
          </p>

        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding:24px 40px;border-top:1px solid #eee;background:#f8f8f8;">
          <h2 style="margin:0 0 4px;font-family:Georgia,serif;font-size:20px;font-weight:700;letter-spacing:2px;color:#16261f;">
            MARCH<span style="color:#b8963e;">&amp;</span>BLOOM
          </h2>
          <p style="margin:0 0 12px;font-size:10px;letter-spacing:4px;color:#16261f;">LAW</p>
          <p style="margin:0;font-size:11px;color:#888;line-height:1.6;">
            This is an automated notification from the March &amp; Bloom Law website quote system.
            Do not reply to this email — use the "Reply to ${lead.firstName}" button above to contact the client directly.
          </p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>
  `;
}

export async function sendLeadNotificationEmail(lead: LeadInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const notificationTo = process.env.LEAD_NOTIFICATION_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !notificationTo || !from) {
    console.warn("[email] Missing env vars — skipping notification email.");
    return;
  }

  const txLabel = transactionLabels[lead.transactionType] ?? lead.transactionType;

  try {
    const resend = new Resend(apiKey);

    // Send both emails in parallel — don't wait for one before starting the other
    await Promise.all([
      resend.emails.send({
        from,
        to: lead.email,
        replyTo: notificationTo,
        subject: `Your ${txLabel} conveyancing quote — March & Bloom Law`,
        html: buildClientEmailHtml(lead),
      }).then(() => {
        console.log("[email] Client email sent to:", lead.email);
      }),

      resend.emails.send({
        from,
        to: notificationTo,
        replyTo: lead.email,
        subject: `New enquiry — ${lead.firstName} ${lead.lastName} (${txLabel})`,
        html: buildInternalEmailHtml(lead),
      }).then(() => {
        console.log("[email] Internal email sent to:", notificationTo);
      }),
    ]);

    console.log("[email] Both emails sent successfully");
  } catch (err) {
    console.error("[email] Failed to send emails:", err);
    // Don't rethrow — lead is already saved, email failure shouldn't fail the whole request
  }
}

