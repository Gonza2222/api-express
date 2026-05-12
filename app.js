import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());

// Servir archivos estáticos del frontend
app.use(express.static(join(__dirname, "public")));

// ── funciones helpers ──────────────────────────────────────────
const leer = async (ruta) =>
  JSON.parse(await fs.promises.readFile(ruta, "utf-8"));
const guardar = async (ruta, data) =>
  await fs.promises.writeFile(ruta, JSON.stringify(data, null, 2));

// Rutas a los archivos JSON (organizados en /data)
const PATHS = {
  productos: "./data/productos.json",
  usuarios:  "./data/usuarios.json",
  ventas:    "./data/ventas.json",
};

/* ================= PRODUCTOS ================= */

app.get("/productos", async (req, res) => {
  const productos = await leer(PATHS.productos);
  const { categoria } = req.query;
  if (categoria) {
    return res.json(
      productos.filter(
        (p) => p.categoria?.toLowerCase() === categoria.toLowerCase()
      )
    );
  }
  res.json(productos);
});

app.get("/productos/:id", async (req, res) => {
  const productos = await leer(PATHS.productos);
  const prod = productos.find((p) => p.id == req.params.id);
  if (!prod) return res.status(404).json({ error: "No encontrado" });
  res.json(prod);
});

app.post("/productos", async (req, res) => {
  const productos = await leer(PATHS.productos);
  const nuevo = { id: productos.length + 1, ...req.body };
  productos.push(nuevo);
  await guardar(PATHS.productos, productos);
  res.json(nuevo);
});

app.put("/productos/:id", async (req, res) => {
  const productos = await leer(PATHS.productos);
  const index = productos.findIndex((p) => p.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: "No encontrado" });
  productos[index] = { ...productos[index], ...req.body };
  await guardar(PATHS.productos, productos);
  res.json({ mensaje: "Actualizado" });
});

app.delete("/productos/:id", async (req, res) => {
  const productos = await leer(PATHS.productos);
  const ventas = await leer(PATHS.ventas);

  // Verificar que el producto existe
  const existe = productos.find((p) => p.id == req.params.id);
  if (!existe) return res.status(404).json({ error: "No encontrado" });

  // Verificar integridad referencial con ventas
  const usado = ventas.some((v) =>
    v.productos.some((p) => p.id_producto == req.params.id)
  );
  if (usado)
    return res
      .status(400)
      .json({ error: "No se puede eliminar, producto en ventas" });

  const nuevosProductos = productos.filter((p) => p.id != req.params.id);
  await guardar(PATHS.productos, nuevosProductos);
  res.json({ mensaje: "Eliminado" });
});

/* ================= USUARIOS ================= */

app.get("/usuarios", async (req, res) => {
  res.json(await leer(PATHS.usuarios));
});

// Buscar usuario por email — debe ir ANTES de /:id
app.get("/usuarios/buscar/email", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Email requerido" });
  const usuarios = await leer(PATHS.usuarios);
  const user = usuarios.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
  const { contraseña, ...userSafe } = user;
  res.json(userSafe);
});

app.get("/usuarios/:id", async (req, res) => {
  const usuarios = await leer(PATHS.usuarios);
  const user = usuarios.find((u) => u.id == req.params.id);
  if (!user) return res.status(404).json({ error: "No encontrado" });
  res.json(user);
});

app.post("/usuarios", async (req, res) => {
  const usuarios = await leer(PATHS.usuarios);
  const nuevo = { id: usuarios.length + 1, ...req.body };
  usuarios.push(nuevo);
  await guardar(PATHS.usuarios, usuarios);
  res.json(nuevo);
});

/* ================= VENTAS ================= */

app.get("/ventas", async (req, res) => {
  res.json(await leer(PATHS.ventas));
});

app.get("/ventas/:id", async (req, res) => {
  const ventas = await leer(PATHS.ventas);
  const venta = ventas.find((v) => v.id == req.params.id);
  if (!venta) return res.status(404).json({ error: "No encontrada" });
  res.json(venta);
});

app.post("/ventas", async (req, res) => {
  const ventas = await leer(PATHS.ventas);
  const usuarios = await leer(PATHS.usuarios);
  const { id_usuario } = req.body;
  const existe = usuarios.find((u) => u.id == id_usuario);
  if (!existe) return res.status(400).json({ error: "Usuario no existe" });
  const nueva = { id: ventas.length + 1, ...req.body };
  ventas.push(nueva);
  await guardar(PATHS.ventas, ventas);
  res.json(nueva);
});

/* ================= SERVER ================= */
app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
});
