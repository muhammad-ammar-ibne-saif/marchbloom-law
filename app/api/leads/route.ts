import { NextRequest, NextResponse } from "next/server";
import { createLead, LeadInput } from "@/lib/leads";
import { sendLeadNotificationEmail } from "@/lib/email";

const VALID_TRANSACTION_TYPES = ["purchase", "sale", "remortgage"];

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: NextRequest) {
  let body: Partial<LeadInput> & { honeypot?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Simple spam trap: a hidden field real users never fill in.
  if (body.honeypot) {
    return NextResponse.json({ ok: true });
  }

  const { firstName, lastName, email, phone, transactionType, propertyValue, isLeasehold, message, estimate } =
    body;

  if (!firstName || !lastName || !email || !phone || !transactionType) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  if (!VALID_TRANSACTION_TYPES.includes(transactionType)) {
    return NextResponse.json({ error: "Invalid transaction type." }, { status: 400 });
  }

  const leadInput: LeadInput = {
    firstName: String(firstName).trim().slice(0, 100),
    lastName: String(lastName).trim().slice(0, 100),
    email: String(email).trim().slice(0, 200),
    phone: String(phone).trim().slice(0, 40),
    transactionType: transactionType as LeadInput["transactionType"],
    propertyValue: typeof propertyValue === "number" ? propertyValue : null,
    isLeasehold: Boolean(isLeasehold),
    message: typeof message === "string" ? message.slice(0, 2000) : "",
    estimate: estimate ?? null,
  };

  try {
    const lead = await createLead(leadInput);
    // Don't let a slow/failed email block the response to the user.
    void sendLeadNotificationEmail(leadInput);
    return NextResponse.json({ ok: true, id: lead._id.toString() });
  } catch (err) {
    console.error("[api/leads] Failed to save lead:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
