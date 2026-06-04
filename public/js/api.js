// public/js/api.js
const BASE = "http://localhost:3000";

function getToken() {
  return localStorage.getItem("techstore_token");
}

export const api = {
  // ── Productos ──────────────────────────────────────────────
  getProductos: () =>
    fetch(`${BASE}/productos`).then((r) => r.json()),

  getProductosPorCategoria: (categoria) =>
    fetch(`${BASE}/productos?categoria=${encodeURIComponent(categoria)}`).then((r) => r.json()),

  // ── Auth ───────────────────────────────────────────────────
  login: (email, contraseña) =>
    fetch(`${BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, contraseña }),
    }).then(async (r) => {
      if (!r.ok) {
        const err = await r.json();
        throw new Error(err.error || "Error al iniciar sesión");
      }
      return r.json();
    }),

  registro: (datos) =>
    fetch(`${BASE}/registro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    }).then(async (r) => {
      if (!r.ok) {
        const err = await r.json();
        throw new Error(err.error || "Error al registrarse");
      }
      return r.json();
    }),

  // ── Ventas (requiere token) ────────────────────────────────
  crearVenta: (venta) =>
    fetch(`${BASE}/ventas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(venta),
    }).then(async (r) => {
      if (!r.ok) {
        const err = await r.json();
        throw new Error(err.error || "Error al crear venta");
      }
      return r.json();
    }),
};
