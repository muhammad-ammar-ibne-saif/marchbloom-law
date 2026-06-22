import { Collection, ObjectId } from "mongodb";
import { getDb } from "./mongodb";

export type AdditionalPerson = {
  fullName: string;
  email: string;
  phone: string;
  correspondenceAddress: string;
};

export type AgentType = "Estate Agent" | "Private";

export type ProceedSubmission = {
  _id: ObjectId;
  leadId: string | null;
  // Step 1 - Your details
  fullName: string;
  email: string;
  phone: string;
  correspondenceAddress: string;
  // Step 2 - Additional people
  additionalPeopleCount: number;
  additionalPeople: AdditionalPerson[];
  // Step 3 - Transactional details (from quote)
  transactionType: string;
  transactionAddress: string;
  transactionValue: number | null;
  isLeasehold: boolean;
  selectedOptions: string[];
  // Step 4 - Agent information
  agentType: AgentType;
  agentCompanyName: string;
  agentContactName: string;
  agentEmail: string;
  agentPhone: string;
  createdAt: Date;
};

export type ProceedInput = Omit<ProceedSubmission, "_id" | "createdAt">;

async function getProceedCollection(): Promise<Collection<ProceedSubmission>> {
  const db = await getDb();
  return db.collection<ProceedSubmission>("proceed_submissions");
}

export async function createProceedSubmission(input: ProceedInput): Promise<ProceedSubmission> {
  const collection = await getProceedCollection();
  const doc = { ...input, createdAt: new Date() };
  const result = await collection.insertOne(doc as ProceedSubmission);
  return { ...doc, _id: result.insertedId };
}