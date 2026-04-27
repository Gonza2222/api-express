const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

// funciones
const leer = (ruta) => JSON.parse(fs.readFileSync(ruta, "utf-8"));
const guardar = (ruta, data) =>
  fs.writeFileSync(ruta, JSON.stringify(data, null, 2));

/* ================= PRODUCTOS ================= */

// GET todos
app.get("/productos", (req, res) => {
  res.json(leer("./productos.json"));
});

// GET por id
app.get("/productos/:id", (req, res) => {
  const productos = leer("./productos.json");
  const prod = productos.find(p => p.id == req.params.id);

  if (!prod) return res.status(404).json({ error: "No encontrado" });
  res.json(prod);
});

// POST crear
app.post("/productos", (req, res) => {
  const productos = leer("./productos.json");

  const nuevo = {
    id: productos.length + 1,
    ...req.body
  };

  productos.push(nuevo);
  guardar("./productos.json", productos);

  res.json(nuevo);
});

// PUT actualizar
app.put("/productos/:id", (req, res) => {
  let productos = leer("./productos.json");

  productos = productos.map(p =>
    p.id == req.params.id ? { ...p, ...req.body } : p
  );

  guardar("./productos.json", productos);
  res.json({ mensaje: "Actualizado" });
});

// DELETE con integridad
app.delete("/productos/:id", (req, res) => {
  let productos = leer("./productos.json");
  const ventas = leer("./ventas.json");

  const usado = ventas.some(v =>
    v.productos.some(p => p.id_producto == req.params.id)
  );

  if (usado) {
    return res.status(400).json({
      error: "No se puede eliminar, producto en ventas"
    });
  }

  productos = productos.filter(p => p.id != req.params.id);
  guardar("./productos.json", productos);

  res.json({ mensaje: "Eliminado" });
});

/* ================= USUARIOS ================= */

app.get("/usuarios", (req, res) => {
  res.json(leer("./usuarios.json"));
});

app.get("/usuarios/:id", (req, res) => {
  const usuarios = leer("./usuarios.json");
  const user = usuarios.find(u => u.id == req.params.id);

  if (!user) return res.status(404).json({ error: "No encontrado" });
  res.json(user);
});

app.post("/usuarios", (req, res) => {
  const usuarios = leer("./usuarios.json");

  const nuevo = {
    id: usuarios.length + 1,
    ...req.body
  };

  usuarios.push(nuevo);
  guardar("./usuarios.json", usuarios);

  res.json(nuevo);
});

/* ================= VENTAS ================= */

app.get("/ventas", (req, res) => {
  res.json(leer("./ventas.json"));
});

app.get("/ventas/:id", (req, res) => {
  const ventas = leer("./ventas.json");
  const venta = ventas.find(v => v.id == req.params.id);

  if (!venta) return res.status(404).json({ error: "No encontrada" });
  res.json(venta);
});

app.post("/ventas", (req, res) => {
  const ventas = leer("./ventas.json");
  const usuarios = leer("./usuarios.json");

  const { id_usuario } = req.body;

  const existe = usuarios.find(u => u.id == id_usuario);
  if (!existe) {
    return res.status(400).json({ error: "Usuario no existe" });
  }

  const nueva = {
    id: ventas.length + 1,
    ...req.body
  };

  ventas.push(nueva);
  guardar("./ventas.json", ventas);

  res.json(nueva);
});

/* ================= SERVER ================= */

app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
});