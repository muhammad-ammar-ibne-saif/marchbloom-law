import { MongoClient, Db } from "mongodb";

const globalForMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

let clientPromise: Promise<MongoClient> | undefined;

/**
 * Lazily creates (or reuses, in dev, across hot reloads) a MongoClient
 * connection. Deliberately does NOT read process.env.MONGODB_URI at module
 * scope — Next.js imports route files to inspect their config at build
 * time, and throwing at import time would break `next build` in any
 * environment where the env var isn't set yet (e.g. CI before secrets are
 * configured).
 */
function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "Missing MONGODB_URI environment variable. Set it in .env.local (see .env.example)."
    );
  }

  if (process.env.NODE_ENV === "development") {
    if (!globalForMongo._mongoClientPromise) {
      const client = new MongoClient(uri);
      globalForMongo._mongoClientPromise = client.connect();
    }
    return globalForMongo._mongoClientPromise;
  }

  if (!clientPromise) {
    const client = new MongoClient(uri);
    clientPromise = client.connect();
  }
  return clientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(process.env.MONGODB_DB_NAME || "marchbloom");
}
