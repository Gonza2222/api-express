// public/js/api.js
const BASE = ""; // mismo origen: funciona tanto en local (server.js) como en producción (Vercel)

function getToken() {
  return localStorage.getItem("techstore_token");
}

async function manejarRespuesta(r) {
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error(err.mensaje || "Ocurrió un error");
  }
  return r.json();
}

function headersAuth() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

export const api = {
  // ── Productos ──────────────────────────────────────────────
  getProductos: () => fetch(`${BASE}/productos`).then(manejarRespuesta),

  getProductosPorCategoria: (categoria) =>
    fetch(`${BASE}/productos?categoria=${encodeURIComponent(categoria)}`).then(manejarRespuesta),

  crearProducto: (producto) =>
    fetch(`${BASE}/productos`, {
      method: "POST",
      headers: headersAuth(),
      body: JSON.stringify(producto),
    }).then(manejarRespuesta),

  actualizarProducto: (id, producto) =>
    fetch(`${BASE}/productos/${id}`, {
      method: "PUT",
      headers: headersAuth(),
      body: JSON.stringify(producto),
    }).then(manejarRespuesta),

  eliminarProducto: (id) =>
    fetch(`${BASE}/productos/${id}`, {
      method: "DELETE",
      headers: headersAuth(),
    }).then(manejarRespuesta),

  // ── Auth ───────────────────────────────────────────────────
  login: (email, contraseña) =>
    fetch(`${BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, contraseña }),
    }).then(manejarRespuesta),

  registro: (datos) =>
    fetch(`${BASE}/registro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    }).then(manejarRespuesta),

  // ── Ventas (requiere token) ────────────────────────────────
  crearVenta: (venta) =>
    fetch(`${BASE}/ventas`, {
      method: "POST",
      headers: headersAuth(),
      body: JSON.stringify(venta),
    }).then(manejarRespuesta),
};
