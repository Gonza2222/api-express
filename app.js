import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import authRoutes from "./routes/authRoutes.js";
import productoRoutes from "./routes/productoRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import ventaRoutes from "./routes/ventaRoutes.js";
import { connectDB } from "./config/db.js";
import { notFound, errorHandler } from "./middlewares/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());

// Asegura la conexión a MongoDB antes de procesar cualquier request
// (idempotente: en Vercel cada invocación reutiliza la conexión cacheada)
app.use((req, res, next) => {
  connectDB().then(() => next()).catch(next);
});

app.use("/", authRoutes);
app.use("/productos", productoRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/ventas", ventaRoutes);

// Archivos estáticos del frontend
app.use(express.static(join(__dirname, "public")));

app.use(notFound);
app.use(errorHandler);

export default app;
