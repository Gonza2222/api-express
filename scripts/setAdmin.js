// Uso: node scripts/setAdmin.js correo@ejemplo.com
// Promueve un usuario existente a es_admin=true. Requiere MONGO_URI en .env.
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Usuario from "../models/Usuario.js";

const email = process.argv[2];

if (!email) {
  console.error("Uso: node scripts/setAdmin.js correo@ejemplo.com");
  process.exit(1);
}

try {
  await connectDB();

  const actualizado = await Usuario.findOneAndUpdate(
    { email: email.toLowerCase() },
    { es_admin: true },
    { returnDocument: "after" }
  );

  if (!actualizado) {
    console.error(`No existe ningún usuario con el email ${email}`);
    process.exitCode = 1;
  } else {
    console.log(`✔ ${actualizado.email} ahora es administrador`);
  }
} catch (err) {
  console.error("Error:", err.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
