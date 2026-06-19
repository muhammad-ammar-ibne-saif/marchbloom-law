"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";
import { updateLeadStatus, LeadStatus } from "@/lib/leads";

async function requireAdminSession(): Promise<boolean> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return false;
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token, secret);
}

export async function updateLeadStatusAction(id: string, status: LeadStatus) {
  const authed = await requireAdminSession();
  if (!authed) {
    return { ok: false, error: "Not authorised." };
  }

  const updated = await updateLeadStatus(id, status);
  if (updated) {
    revalidatePath(`/admin/leads/${id}`);
    revalidatePath("/admin");
  }
  return { ok: updated };
}
