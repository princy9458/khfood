import mongoose from "mongoose";

const getMongoUri = () => process.env.MONGO_URI || process.env.MONGODB_URI;
const isPlaceholderMongoUri = (uri?: string) =>
  !uri ||
  uri.includes("<user>") ||
  uri.includes("<password>") ||
  uri.includes("@cluster.mongodb.net");

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const mongoUri = getMongoUri();

    if (isPlaceholderMongoUri(mongoUri)) {
      throw new Error(
        "Please set MONGO_URI or MONGODB_URI to a real MongoDB connection string. The current value is still using the sample Atlas host.",
      );
    }

    const opts = {
      bufferCommands: false,
      dbName: process.env.TENANT_DB_NAME || "kalp_tenant_surplus",
    };

    console.log("Attempting to connect to MongoDB...");
    cached.promise = mongoose.connect(mongoUri, opts).then((mongoose) => {
      console.log("✅ MongoDB Connected Successfully");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    console.error("❌ MongoDB Connection Error:", e);
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
