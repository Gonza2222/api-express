// public/js/api.js
const BASE = "http://localhost:3000";

export const api = {
  // ── Productos ──────────────────────────────────────────────
  getProductos: () =>
    fetch(`${BASE}/productos`).then((r) => r.json()),

  getProductosPorCategoria: (categoria) =>
    fetch(`${BASE}/productos?categoria=${encodeURIComponent(categoria)}`).then(
      (r) => r.json()
    ),

  getProducto: (id) =>
    fetch(`${BASE}/productos/${id}`).then((r) => r.json()),

  // ── Usuarios ───────────────────────────────────────────────
  buscarUsuarioPorEmail: (email) =>
    fetch(`${BASE}/usuarios/buscar/email?email=${encodeURIComponent(email)}`).then(
      async (r) => {
        if (!r.ok) throw new Error("Usuario no encontrado");
        return r.json();
      }
    ),

  registrarUsuario: (datos) =>
    fetch(`${BASE}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    }).then(async (r) => {
      if (!r.ok) throw new Error("Error al registrar");
      return r.json();
    }),

  // ── Ventas ─────────────────────────────────────────────────
  crearVenta: (venta) =>
    fetch(`${BASE}/ventas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(venta),
    }).then(async (r) => {
      if (!r.ok) {
        const err = await r.json();
        throw new Error(err.error || "Error al crear venta");
      }
      return r.json();
    }),
};
