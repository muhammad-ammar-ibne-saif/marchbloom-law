import { MongoClient, Db } from "mongodb";

const globalForMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

let clientPromise: Promise<MongoClient> | undefined;

const options = {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 10000,
};

function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("[mongodb] MONGODB_URI is not set");
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  console.log("[mongodb] Connecting, NODE_ENV:", process.env.NODE_ENV);

  if (process.env.NODE_ENV === "development") {
    if (!globalForMongo._mongoClientPromise) {
      const client = new MongoClient(uri, options);
      globalForMongo._mongoClientPromise = client.connect();
    }
    return globalForMongo._mongoClientPromise;
  }

  if (!clientPromise) {
    const client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
  return clientPromise;
}

export async function getDb(): Promise<Db> {
  console.log("[mongodb] getDb called");
  try {
    const client = await getClientPromise();
    console.log("[mongodb] client connected");
    const dbName = process.env.MONGODB_DB_NAME || "marchbloom";
    const db = client.db(dbName);
    console.log("[mongodb] db selected:", dbName);
    return db;
  } catch (err) {
    console.error("[mongodb] connection failed:", err);
    throw err;
  }
}