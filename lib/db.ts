import { MongoClient, Db } from "mongodb";

let MONGODB_URI = process.env.MONGODB_URI;
const TENANT_DB_NAME = process.env.TENANT_DB_NAME;

const isPlaceholderMongoUri = (uri?: string) =>
  !uri ||
  uri.includes("<user>") ||
  uri.includes("<password>") ||
  uri.includes("@cluster.mongodb.net");

if (
  MONGODB_URI?.startsWith("mongodb+srv://") &&
  MONGODB_URI.includes("@kalpcluster.mr8bacs.mongodb.net")
) {
  MONGODB_URI = MONGODB_URI.replace(
    "@kalpcluster.mr8bacs.mongodb.net/",
    "@ac-zxbieql-shard-00-00.mr8bacs.mongodb.net:27017,ac-zxbieql-shard-00-01.mr8bacs.mongodb.net:27017,ac-zxbieql-shard-00-02.mr8bacs.mongodb.net:27017/?ssl=true&replicaSet=atlas-vw7phq-shard-0&authSource=admin&retryWrites=true&w=majority",
  ).replace("mongodb+srv://", "mongodb://");
}

if (isPlaceholderMongoUri(MONGODB_URI)) {
  throw new Error(
    "Please set MONGODB_URI to a real MongoDB connection string. The current value is still using the sample Atlas host.",
  );
}

if (!TENANT_DB_NAME) {
  throw new Error(
    "Please define the TENANT_DB_NAME environment variable inside .env",
  );
}

let cachedClient = (global as any).mongoClient;

if (!cachedClient) {
  cachedClient = (global as any).mongoClient = { conn: null, promise: null };
}

export async function connectClient(): Promise<MongoClient> {
  if (cachedClient.conn) return cachedClient.conn;

  if (!cachedClient.promise) {
    cachedClient.promise = MongoClient.connect(MONGODB_URI as string);
  }

  try {
    cachedClient.conn = await cachedClient.promise;
    console.log("✅ DB Connected Successfully");
  } catch (e) {
    cachedClient.promise = null;
    throw e;
  }

  return cachedClient.conn;
}

export async function connectMasterDB(): Promise<Db> {
  const client = await connectClient();
  return client.db("kalp_master");
}

export async function connectTenantDB(): Promise<Db> {
  const client = await connectClient();
  return client.db(TENANT_DB_NAME);
}
