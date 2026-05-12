// public/js/carrito.js
// Módulo de carrito con persistencia en localStorage

const CLAVE = "carrito_techstore";

export const carrito = {
  obtener() {
    return JSON.parse(localStorage.getItem(CLAVE) || "[]");
  },

  guardar(items) {
    localStorage.setItem(CLAVE, JSON.stringify(items));
    actualizarBadge();
  },

  agregar(producto) {
    const items = this.obtener();
    const existe = items.find((i) => i.id === producto.id);
    if (existe) {
      existe.cantidad += 1;
    } else {
      items.push({ ...producto, cantidad: 1 });
    }
    this.guardar(items);
  },

  quitar(id) {
    const items = this.obtener().filter((i) => i.id !== id);
    this.guardar(items);
  },

  cambiarCantidad(id, cantidad) {
    const items = this.obtener();
    const item = items.find((i) => i.id === id);
    if (item) {
      item.cantidad = Math.max(1, cantidad);
      this.guardar(items);
    }
  },

  vaciar() {
    this.guardar([]);
  },

  total() {
    return this.obtener().reduce(
      (acc, i) => acc + i.precio * i.cantidad,
      0
    );
  },

  cantidad() {
    return this.obtener().reduce((acc, i) => acc + i.cantidad, 0);
  },
};

// Actualiza el badge del ícono del carrito en el nav
export function actualizarBadge() {
  const badge = document.getElementById("carrito-badge");
  if (!badge) return;
  const cant = carrito.cantidad();
  badge.textContent = cant;
  badge.style.display = cant > 0 ? "flex" : "none";
}
