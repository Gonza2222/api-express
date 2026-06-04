// public/js/carrito.js
const CLAVE = "carrito_techstore";

function getId(item) {
  return item._id || item.id;
}

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
    const id = getId(producto);
    const existe = items.find((i) => getId(i) === id);
    if (existe) {
      existe.cantidad += 1;
    } else {
      items.push({ ...producto, cantidad: 1 });
    }
    this.guardar(items);
  },

  quitar(id) {
    const items = this.obtener().filter((i) => getId(i) !== id);
    this.guardar(items);
  },

  cambiarCantidad(id, cantidad) {
    const items = this.obtener();
    const item = items.find((i) => getId(i) === id);
    if (item) {
      item.cantidad = Math.max(1, cantidad);
      this.guardar(items);
    }
  },

  vaciar() {
    this.guardar([]);
  },

  total() {
    return this.obtener().reduce((acc, i) => acc + i.precio * i.cantidad, 0);
  },

  cantidad() {
    return this.obtener().reduce((acc, i) => acc + i.cantidad, 0);
  },
};

export function actualizarBadge() {
  const badge = document.getElementById("carrito-badge");
  if (!badge) return;
  const cant = carrito.cantidad();
  badge.textContent = cant;
  badge.style.display = cant > 0 ? "flex" : "none";
}