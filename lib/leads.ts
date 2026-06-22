import { Collection, ObjectId } from "mongodb";
import { getDb } from "./mongodb";
import { DetailedBreakdown, LeaseholdType } from "./pricing";

export type LeadStatus = "new" | "contacted" | "quoted" | "instructed" | "completed";

export type PropertySection = {
  transactionAddress: string;
  addressUnknown: boolean;
  propertyValue: number | null;
  isLeasehold: boolean;
  leaseholdType: LeaseholdType | null;
  peopleInvolved: number;
  additionalOptions: string[];
};

export type Lead = {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  transactionType: "purchase" | "sale" | "sale-purchase" | "remortgage" | "transfer-of-equity";
  transactionAddress: string;
  addressUnknown: boolean;
  propertyValue: number | null;
  isLeasehold: boolean;
  leaseholdType: LeaseholdType | null;
  peopleInvolved: number;
  hasMortgage: boolean | null;
  remortgageValue: number | null;
  peopleBeingAdded: number | null;
  peopleBeingRemoved: number | null;
  additionalOptions: string[];
  saleSection: PropertySection | null;
  purchaseSection: PropertySection | null;
  saleBreakdown: DetailedBreakdown | null;
  purchaseBreakdown: DetailedBreakdown | null;
  singleBreakdown: DetailedBreakdown | null;
  combinedTotal: number | null;
  intent: "discuss" | "proceed" | null;
  message: string;
  status: LeadStatus;
  createdAt: Date;
};

export type LeadInput = Omit<Lead, "_id" | "status" | "createdAt">;

async function getLeadsCollection(): Promise<Collection<Lead>> {
  const db = await getDb();
  return db.collection<Lead>("leads");
}

export async function createLead(input: LeadInput): Promise<Lead> {
  const collection = await getLeadsCollection();
  const doc = { ...input, status: "new" as LeadStatus, createdAt: new Date() };
  const result = await collection.insertOne(doc as Lead);
  return { ...doc, _id: result.insertedId };
}

export type LeadFilters = {
  search?: string;
  transactionType?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
};

export async function listLeads(filters: LeadFilters = {}) {
  const collection = await getLeadsCollection();
  const { search, transactionType, status, dateFrom, dateTo } = filters;
  const page = Math.max(filters.page ?? 1, 1);
  const pageSize = filters.pageSize ?? 20;
  const query: Record<string, unknown> = {};

  if (search) {
    const regex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    query.$or = [{ firstName: regex }, { lastName: regex }, { email: regex }, { phone: regex }];
  }
  if (transactionType && transactionType !== "all") query.transactionType = transactionType;
  if (status && status !== "all") query.status = status;
  if (dateFrom || dateTo) {
    const createdAt: Record<string, Date> = {};
    if (dateFrom) createdAt.$gte = new Date(dateFrom);
    if (dateTo) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59, 999);
      createdAt.$lte = end;
    }
    query.createdAt = createdAt;
  }

  const [leads, total] = await Promise.all([
    collection.find(query).sort({ createdAt: -1 }).skip((page - 1) * pageSize).limit(pageSize).toArray(),
    collection.countDocuments(query),
  ]);

  return { leads, total, page, pageSize, totalPages: Math.max(Math.ceil(total / pageSize), 1) };
}

export async function getLeadById(id: string): Promise<Lead | null> {
  if (!ObjectId.isValid(id)) return null;
  const collection = await getLeadsCollection();
  return collection.findOne({ _id: new ObjectId(id) });
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const collection = await getLeadsCollection();
  const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { status } });
  return result.modifiedCount > 0;
}