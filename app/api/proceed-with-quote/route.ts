import { NextRequest, NextResponse } from "next/server";
import { createProceedSubmission, ProceedInput } from "@/lib/proceed";
import { Resend } from "resend";

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function formatGBP(n: number) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);
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

    // Send email notification
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.LEAD_NOTIFICATION_EMAIL;
    const from = process.env.RESEND_FROM_EMAIL;

    if (apiKey && to && from) {
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
        subject: `Proceeding with quote — ${input.fullName} (${input.transactionType})`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
            <h2 style="color:#16261f;">Client proceeding with quote</h2>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td colspan="2" style="padding:8px 12px 2px;font-size:11px;font-weight:700;color:#9bb5a4;text-transform:uppercase;">Your Details</td></tr>
              <tr><td style="padding:4px 12px;color:#5c6b62;font-size:13px;">Full Name</td><td style="padding:4px 12px;font-weight:600;color:#16261f;font-size:13px;">${input.fullName}</td></tr>
              <tr><td style="padding:4px 12px;color:#5c6b62;font-size:13px;">Email</td><td style="padding:4px 12px;font-weight:600;color:#16261f;font-size:13px;">${input.email}</td></tr>
              <tr><td style="padding:4px 12px;color:#5c6b62;font-size:13px;">Phone</td><td style="padding:4px 12px;font-weight:600;color:#16261f;font-size:13px;">${input.phone}</td></tr>
              <tr><td style="padding:4px 12px;color:#5c6b62;font-size:13px;">Correspondence Address</td><td style="padding:4px 12px;font-weight:600;color:#16261f;font-size:13px;">${input.correspondenceAddress}</td></tr>
              ${additionalPeopleHtml}
              <tr><td colspan="2" style="padding:8px 12px 2px;font-size:11px;font-weight:700;color:#9bb5a4;text-transform:uppercase;">Transaction Details</td></tr>
              <tr><td style="padding:4px 12px;color:#5c6b62;font-size:13px;">Type</td><td style="padding:4px 12px;font-weight:600;color:#16261f;font-size:13px;">${input.transactionType}</td></tr>
              <tr><td style="padding:4px 12px;color:#5c6b62;font-size:13px;">Address</td><td style="padding:4px 12px;font-weight:600;color:#16261f;font-size:13px;">${input.transactionAddress || "—"}</td></tr>
              <tr><td style="padding:4px 12px;color:#5c6b62;font-size:13px;">Value</td><td style="padding:4px 12px;font-weight:600;color:#16261f;font-size:13px;">${input.transactionValue ? formatGBP(input.transactionValue) : "—"}</td></tr>
              <tr><td style="padding:4px 12px;color:#5c6b62;font-size:13px;">Tenure</td><td style="padding:4px 12px;font-weight:600;color:#16261f;font-size:13px;">${input.isLeasehold ? "Leasehold" : "Freehold"}</td></tr>
              ${input.selectedOptions.length ? `<tr><td style="padding:4px 12px;color:#5c6b62;font-size:13px;">Options</td><td style="padding:4px 12px;font-weight:600;color:#16261f;font-size:13px;">${input.selectedOptions.join(", ")}</td></tr>` : ""}
              <tr><td colspan="2" style="padding:8px 12px 2px;font-size:11px;font-weight:700;color:#9bb5a4;text-transform:uppercase;">Agent Information</td></tr>
              <tr><td style="padding:4px 12px;color:#5c6b62;font-size:13px;">Agent Type</td><td style="padding:4px 12px;font-weight:600;color:#16261f;font-size:13px;">${input.agentType}</td></tr>
              ${input.agentCompanyName ? `<tr><td style="padding:4px 12px;color:#5c6b62;font-size:13px;">Company</td><td style="padding:4px 12px;font-weight:600;color:#16261f;font-size:13px;">${input.agentCompanyName}</td></tr>` : ""}
              <tr><td style="padding:4px 12px;color:#5c6b62;font-size:13px;">Contact Name</td><td style="padding:4px 12px;font-weight:600;color:#16261f;font-size:13px;">${input.agentContactName}</td></tr>
              <tr><td style="padding:4px 12px;color:#5c6b62;font-size:13px;">Agent Email</td><td style="padding:4px 12px;font-weight:600;color:#16261f;font-size:13px;">${input.agentEmail}</td></tr>
              <tr><td style="padding:4px 12px;color:#5c6b62;font-size:13px;">Agent Phone</td><td style="padding:4px 12px;font-weight:600;color:#16261f;font-size:13px;">${input.agentPhone}</td></tr>
            </table>
          </div>
        `,
      });
    }

    return NextResponse.json({ ok: true, id: submission._id.toString() });
  } catch (err) {
    console.error("[proceed] Failed to save submission:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}