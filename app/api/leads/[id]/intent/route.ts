import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  if (!ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: "Invalid lead id." }, { status: 400 });
  }

  let body: { intent?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (body.intent !== "discuss" && body.intent !== "proceed") {
    return NextResponse.json({ error: "Invalid intent value." }, { status: 400 });
  }

  try {
    const db = await getDb();
    await db.collection("leads").updateOne({ _id: new ObjectId(params.id) }, { $set: { intent: body.intent } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/leads/intent] Failed to update intent:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}