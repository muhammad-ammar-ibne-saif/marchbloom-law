import { NextRequest, NextResponse } from "next/server";
import { createLead, LeadInput } from "@/lib/leads";
import { sendLeadNotificationEmail } from "@/lib/email";
import { DetailedBreakdown, LineItem } from "@/lib/pricing"

const VALID_TYPES = ["purchase", "sale", "sale-purchase", "remortgage", "transfer-of-equity"];

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function parseLeaseholdType(val: unknown): "standard" | "high-rise" | null {
  if (val === "high-rise") return "high-rise";
  if (val === "standard") return "standard";
  return null;
}

function parseSection(raw: unknown) {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  return {
    transactionAddress: String(r.transactionAddress ?? "").slice(0, 500),
    addressUnknown: Boolean(r.addressUnknown),
    propertyValue: typeof r.propertyValue === "number" ? r.propertyValue : null,
    isLeasehold: Boolean(r.isLeasehold),
    leaseholdType: parseLeaseholdType(r.leaseholdType),
    peopleInvolved: typeof r.peopleInvolved === "number" ? r.peopleInvolved : 1,
    additionalOptions: Array.isArray(r.additionalOptions) ? r.additionalOptions.map(String) : [],
  };
}

function parseLineItems(raw: unknown): LineItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
    .map((item) => ({
      label: String(item.label ?? ""),
      amount: typeof item.amount === "number" ? item.amount : 0,
    }));
}

function parseBreakdown(raw: unknown): DetailedBreakdown | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  return {
    legalFee: typeof r.legalFee === "number" ? r.legalFee : 0,
    legalFeeVat: typeof r.legalFeeVat === "number" ? r.legalFeeVat : 0,
    leaseholdFee: typeof r.leaseholdFee === "number" ? r.leaseholdFee : 0,
    leaseholdLabel: typeof r.leaseholdLabel === "string" ? r.leaseholdLabel : null,
    supplements: parseLineItems(r.supplements),
    supplementsVat: typeof r.supplementsVat === "number" ? r.supplementsVat : 0,
    unpricedOptions: Array.isArray(r.unpricedOptions) ? r.unpricedOptions.map(String) : [],
    disbursements: parseLineItems(r.disbursements),
    sdlt: typeof r.sdlt === "number" ? r.sdlt : null,
    subtotal: typeof r.subtotal === "number" ? r.subtotal : 0,
  };
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown> & { honeypot?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (body.honeypot) return NextResponse.json({ ok: true });

  const { firstName, lastName, email, phone, transactionType } = body;
  if (!firstName || !lastName || !email || !phone || !transactionType) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }
  if (!isValidEmail(String(email))) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }
  if (!VALID_TYPES.includes(String(transactionType))) {
    return NextResponse.json({ error: "Invalid transaction type." }, { status: 400 });
  }

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
    saleSection: parseSection(body.saleSection),
    purchaseSection: parseSection(body.purchaseSection),
    saleBreakdown: parseBreakdown(body.saleBreakdown),
    purchaseBreakdown: parseBreakdown(body.purchaseBreakdown),
    singleBreakdown: parseBreakdown(body.singleBreakdown),
    combinedTotal: typeof body.combinedTotal === "number" ? body.combinedTotal : null,
    intent: null,
    message: typeof body.message === "string" ? body.message.slice(0, 2000) : "",
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