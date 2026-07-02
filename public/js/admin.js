// public/js/admin.js
import { api } from "./api.js";
import { actualizarBadge } from "./carrito.js";
import { auth, actualizarNavUsuario } from "./auth.js";

const usuario = auth.getUsuario();
if (!usuario || !usuario.es_admin) {
  window.location.href = "index.html";
}

actualizarBadge();
actualizarNavUsuario();

const tabla = document.getElementById("tabla-productos");
const adminError = document.getElementById("admin-error");
const toast = document.getElementById("toast");

const modalEl = document.getElementById("modalProducto");
const modal = new bootstrap.Modal(modalEl);
const form = document.getElementById("form-producto");
const modalTitulo = document.getElementById("modal-titulo");
const modalError = document.getElementById("modal-error");

let productos = [];

function formatPrecio(n) {
  return n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
}

function mostrarToast(msg) {
  toast.textContent = msg;
  toast.classList.add("visible");
  setTimeout(() => toast.classList.remove("visible"), 2500);
}

function renderTabla() {
  if (productos.length === 0) {
    tabla.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">No hay productos cargados.</td></tr>`;
    return;
  }

  tabla.innerHTML = productos
    .map(
      (p) => `
    <tr>
      <td>${p.nombre}</td>
      <td>${p.categoria}</td>
      <td>${formatPrecio(p.precio)}</td>
      <td>${p.stock}</td>
      <td>${p.disponible ? "✅" : "❌"}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-outline-light me-2" data-accion="editar" data-id="${p._id}">Editar</button>
        <button class="btn btn-sm btn-outline-danger" data-accion="eliminar" data-id="${p._id}">Eliminar</button>
      </td>
    </tr>
  `
    )
    .join("");

  tabla.querySelectorAll('[data-accion="editar"]').forEach((btn) =>
    btn.addEventListener("click", () => abrirModalEditar(btn.dataset.id))
  );
  tabla.querySelectorAll('[data-accion="eliminar"]').forEach((btn) =>
    btn.addEventListener("click", () => eliminarProducto(btn.dataset.id))
  );
}

async function cargarProductos() {
  try {
    productos = await api.getProductos();
    renderTabla();
  } catch (e) {
    adminError.textContent = e.message || "Error al cargar productos";
  }
}

function abrirModalNuevo() {
  form.reset();
  document.getElementById("prod-id").value = "";
  document.getElementById("prod-disponible").checked = true;
  modalTitulo.textContent = "Nuevo producto";
  modalError.textContent = "";
}

function abrirModalEditar(id) {
  const p = productos.find((prod) => prod._id === id);
  if (!p) return;
  document.getElementById("prod-id").value = p._id;
  document.getElementById("prod-nombre").value = p.nombre;
  document.getElementById("prod-desc").value = p.desc;
  document.getElementById("prod-categoria").value = p.categoria;
  document.getElementById("prod-precio").value = p.precio;
  document.getElementById("prod-stock").value = p.stock;
  document.getElementById("prod-disponible").checked = p.disponible;
  modalTitulo.textContent = "Editar producto";
  modalError.textContent = "";
  modal.show();
}

async function eliminarProducto(id) {
  const p = productos.find((prod) => prod._id === id);
  if (!confirm(`¿Eliminar "${p?.nombre}"? Esta acción no se puede deshacer.`)) return;

  try {
    await api.eliminarProducto(id);
    mostrarToast(`Producto eliminado`);
    await cargarProductos();
  } catch (e) {
    adminError.textContent = e.message || "No se pudo eliminar el producto";
  }
}

document.getElementById("btn-nuevo").addEventListener("click", abrirModalNuevo);

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  modalError.textContent = "";

  const id = document.getElementById("prod-id").value;
  const datos = {
    nombre: document.getElementById("prod-nombre").value.trim(),
    desc: document.getElementById("prod-desc").value.trim(),
    categoria: document.getElementById("prod-categoria").value.trim(),
    precio: Number(document.getElementById("prod-precio").value),
    stock: Number(document.getElementById("prod-stock").value),
    disponible: document.getElementById("prod-disponible").checked,
  };

  try {
    if (id) {
      await api.actualizarProducto(id, datos);
      mostrarToast("Producto actualizado");
    } else {
      await api.crearProducto(datos);
      mostrarToast("Producto creado");
    }
    modal.hide();
    await cargarProductos();
  } catch (e) {
    modalError.textContent = e.message || "Error al guardar el producto";
  }
});

cargarProductos();
