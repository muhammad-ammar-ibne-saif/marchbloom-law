import { NextRequest, NextResponse } from "next/server";
import { createLead, LeadInput } from "@/lib/leads";
import { sendLeadNotificationEmail } from "@/lib/email";

const VALID_TYPES = ["purchase", "sale", "sale-purchase", "remortgage", "transfer-of-equity"];

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function parseLeaseholdType(val: unknown): "standard" | "high-rise" | null {
  if (val === "high-rise") return "high-rise";
  if (val === "standard") return "standard";
  return null;
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown> & { honeypot?: string };
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }

  if (body.honeypot) return NextResponse.json({ ok: true });

  const { firstName, lastName, email, phone, transactionType } = body;
  if (!firstName || !lastName || !email || !phone || !transactionType)
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  if (!isValidEmail(String(email)))
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  if (!VALID_TYPES.includes(String(transactionType)))
    return NextResponse.json({ error: "Invalid transaction type." }, { status: 400 });

  // Parse sale & purchase sub-sections if provided
  const rawSale = body.saleSection as Record<string, unknown> | null | undefined;
  const rawPurchase = body.purchaseSection as Record<string, unknown> | null | undefined;

  const saleSection = rawSale ? {
    transactionAddress: String(rawSale.transactionAddress ?? "").slice(0, 500),
    addressUnknown: Boolean(rawSale.addressUnknown),
    propertyValue: typeof rawSale.propertyValue === "number" ? rawSale.propertyValue : null,
    isLeasehold: Boolean(rawSale.isLeasehold),
    leaseholdType: parseLeaseholdType(rawSale.leaseholdType),
    peopleInvolved: typeof rawSale.peopleInvolved === "number" ? rawSale.peopleInvolved : 1,
    additionalOptions: Array.isArray(rawSale.additionalOptions) ? rawSale.additionalOptions.map(String) : [],
  } : null;

  const purchaseSection = rawPurchase ? {
    transactionAddress: String(rawPurchase.transactionAddress ?? "").slice(0, 500),
    addressUnknown: Boolean(rawPurchase.addressUnknown),
    propertyValue: typeof rawPurchase.propertyValue === "number" ? rawPurchase.propertyValue : null,
    isLeasehold: Boolean(rawPurchase.isLeasehold),
    leaseholdType: parseLeaseholdType(rawPurchase.leaseholdType),
    peopleInvolved: typeof rawPurchase.peopleInvolved === "number" ? rawPurchase.peopleInvolved : 1,
    additionalOptions: Array.isArray(rawPurchase.additionalOptions) ? rawPurchase.additionalOptions.map(String) : [],
  } : null;

  const leadInput: LeadInput = {
    firstName: String(firstName).trim().slice(0, 100),
    lastName: String(lastName).trim().slice(0, 100),
    email: String(email).trim().slice(0, 200),
    phone: String(phone).trim().slice(0, 40),
    transactionType: transactionType as LeadInput["transactionType"],
    transactionAddress: typeof body.transactionAddress === "string" ? body.transactionAddress.slice(0, 500) : "",
    addressUnknown: Boolean(body.addressUnknown),
    propertyValue: typeof body.propertyValue === "number" ? body.propertyValue : null,
    isLeasehold: Boolean(body.isLeasehold),
    leaseholdType: parseLeaseholdType(body.leaseholdType),
    peopleInvolved: typeof body.peopleInvolved === "number" ? body.peopleInvolved : 1,
    hasMortgage: typeof body.hasMortgage === "boolean" ? body.hasMortgage : null,
    remortgageValue: typeof body.remortgageValue === "number" ? body.remortgageValue : null,
    peopleBeingAdded: typeof body.peopleBeingAdded === "number" ? body.peopleBeingAdded : null,
    peopleBeingRemoved: typeof body.peopleBeingRemoved === "number" ? body.peopleBeingRemoved : null,
    additionalOptions: Array.isArray(body.additionalOptions) ? body.additionalOptions.map(String) : [],
    saleSection,
    purchaseSection,
    message: typeof body.message === "string" ? body.message.slice(0, 2000) : "",
    estimate: (body.estimate as LeadInput["estimate"]) ?? null,
  };

  try {
    const lead = await createLead(leadInput);
    void sendLeadNotificationEmail(leadInput);
    return NextResponse.json({ ok: true, id: lead._id.toString() });
  } catch (err) {
    console.error("[api/leads] Failed to save lead:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}