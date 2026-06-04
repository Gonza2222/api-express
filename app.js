import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import Producto from "./models/Producto.js";
import Usuario from "./models/Usuario.js";
import Venta from "./models/Venta.js";
import { verificarToken } from "./middleware/auth.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());

// ── Conexión MongoDB ───────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error conectando a MongoDB:", err));

/* ================= AUTH ================= */

app.post("/login", async (req, res) => {
  const { email, contraseña } = req.body;
  if (!email || !contraseña)
    return res.status(400).json({ error: "Email y contraseña requeridos" });

  const usuario = await Usuario.findOne({ email: email.toLowerCase() });
  if (!usuario)
    return res.status(404).json({ error: "Usuario no encontrado" });

  const valido = await usuario.verificarContraseña(contraseña);
  if (!valido)
    return res.status(401).json({ error: "Contraseña incorrecta" });

  const token = jwt.sign(
    { id: usuario._id, email: usuario.email, nombre: usuario.nombre, apellido: usuario.apellido },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  res.json({
    token,
    usuario: {
      id: usuario._id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
    },
  });
});

app.post("/registro", async (req, res) => {
  const { nombre, apellido, email, contraseña } = req.body;
  if (!nombre || !apellido || !email || !contraseña)
    return res.status(400).json({ error: "Todos los campos son requeridos" });

  const existe = await Usuario.findOne({ email: email.toLowerCase() });
  if (existe)
    return res.status(400).json({ error: "El email ya está registrado" });

  const nuevo = new Usuario({ nombre, apellido, email: email.toLowerCase(), contraseña, activo: true, es_admin: false });
  await nuevo.save();

  const token = jwt.sign(
    { id: nuevo._id, email: nuevo.email, nombre: nuevo.nombre, apellido: nuevo.apellido },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  res.json({
    token,
    usuario: {
      id: nuevo._id,
      nombre: nuevo.nombre,
      apellido: nuevo.apellido,
      email: nuevo.email,
    },
  });
});

/* ================= PRODUCTOS ================= */

app.get("/productos", async (req, res) => {
  const filtro = {};
  if (req.query.categoria) filtro.categoria = req.query.categoria;
  const productos = await Producto.find(filtro);
  res.json(productos);
});

app.get("/productos/:id", async (req, res) => {
  const prod = await Producto.findById(req.params.id);
  if (!prod) return res.status(404).json({ error: "No encontrado" });
  res.json(prod);
});

app.post("/productos", async (req, res) => {
  const nuevo = new Producto(req.body);
  await nuevo.save();
  res.json(nuevo);
});

app.put("/productos/:id", async (req, res) => {
  const prod = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!prod) return res.status(404).json({ error: "No encontrado" });
  res.json({ mensaje: "Actualizado", prod });
});

app.delete("/productos/:id", async (req, res) => {
  const prod = await Producto.findById(req.params.id);
  if (!prod) return res.status(404).json({ error: "No encontrado" });
  const usado = await Venta.findOne({ "productos.id_producto": req.params.id });
  if (usado) return res.status(400).json({ error: "No se puede eliminar, producto en ventas" });
  await Producto.findByIdAndDelete(req.params.id);
  res.json({ mensaje: "Eliminado" });
});

/* ================= USUARIOS ================= */

app.get("/usuarios", async (req, res) => {
  const usuarios = await Usuario.find().select("-contraseña");
  res.json(usuarios);
});

// Buscar por email — debe ir ANTES de /:id
app.get("/usuarios/buscar/email", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Email requerido" });
  const usuario = await Usuario.findOne({ email: email.toLowerCase() }).select("-contraseña");
  if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
  res.json(usuario);
});

app.get("/usuarios/:id", async (req, res) => {
  const usuario = await Usuario.findById(req.params.id).select("-contraseña");
  if (!usuario) return res.status(404).json({ error: "No encontrado" });
  res.json(usuario);
});

app.post("/usuarios", async (req, res) => {
  const nuevo = new Usuario(req.body);
  await nuevo.save();
  const { contraseña, ...safe } = nuevo.toObject();
  res.json(safe);
});

/* ================= VENTAS ================= */

app.get("/ventas", async (req, res) => {
  const ventas = await Venta.find().populate("id_usuario", "nombre apellido email");
  res.json(ventas);
});

app.get("/ventas/:id", async (req, res) => {
  const venta = await Venta.findById(req.params.id);
  if (!venta) return res.status(404).json({ error: "No encontrada" });
  res.json(venta);
});

app.post("/ventas", verificarToken, async (req, res) => {
  const usuario = await Usuario.findById(req.usuario.id);
  if (!usuario) return res.status(400).json({ error: "Usuario no existe" });

  const nueva = new Venta({
    ...req.body,
    id_usuario: req.usuario.id,
    fecha: new Date().toISOString().split("T")[0],
  });
  await nueva.save();
  res.json(nueva);
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 3000;

// Static files al final para no interferir con las rutas API
app.use(express.static(join(__dirname, "public")));

app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
