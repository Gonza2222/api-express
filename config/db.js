import mongoose from "mongoose";

let cached = global._mongooseCache;

if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!process.env.MONGO_URI) {
    throw new Error("Falta la variable de entorno MONGO_URI");
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI)
      .then((mongooseInstance) => {
        console.log("Conectado a MongoDB");
        return mongooseInstance;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
