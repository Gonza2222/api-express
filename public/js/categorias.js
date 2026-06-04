// public/js/categorias.js
import { api } from "./api.js";
import { carrito, actualizarBadge } from "./carrito.js";
import { actualizarNavUsuario } from "./auth.js";

actualizarBadge();
actualizarNavUsuario();

const grid = document.getElementById("productos-grid");
const filtros = document.getElementById("filtros");
const titulo = document.getElementById("categoria-titulo");
const toast = document.getElementById("toast");

let todosLosProductos = [];
let categoriaActiva = "Todas";

function formatPrecio(n) {
  return n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
}

function mostrarToast(msg) {
  toast.textContent = msg;
  toast.classList.add("visible");
  setTimeout(() => toast.classList.remove("visible"), 2000);
}

function iconoPorCategoria(cat) {
  const iconos = { Notebooks: "💻", Periféricos: "⌨️", Monitores: "🖥️", Audio: "🎧" };
  return iconos[cat] || "📦";
}

function renderFiltros(categorias) {
  const todas = ["Todas", ...categorias];
  filtros.innerHTML = todas
    .map(
      (c) => `
    <button class="filtro-btn ${c === categoriaActiva ? "activo" : ""}" data-cat="${c}">
      ${c !== "Todas" ? iconoPorCategoria(c) + " " : ""}${c}
    </button>
  `
    )
    .join("");

  filtros.querySelectorAll(".filtro-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      categoriaActiva = btn.dataset.cat;
      renderFiltros(categorias);
      const filtrados =
        categoriaActiva === "Todas"
          ? todosLosProductos
          : todosLosProductos.filter((p) => p.categoria === categoriaActiva);
      titulo.textContent =
        categoriaActiva === "Todas" ? "Todos los productos" : categoriaActiva;
      renderProductos(filtrados);
    });
  });
}

function renderProductos(lista) {
  if (lista.length === 0) {
    grid.innerHTML = `<p class="sin-resultados">No hay productos en esta categoría.</p>`;
    return;
  }
  grid.innerHTML = lista
    .map(
      (p) => `
    <div class="card ${!p.disponible ? "agotado" : ""}">
      <div class="card-img">
        <span class="categoria-tag">${p.categoria}</span>
        <div class="producto-icon">${iconoPorCategoria(p.categoria)}</div>
        ${!p.disponible ? '<div class="agotado-overlay">Sin stock</div>' : ""}
      </div>
      <div class="card-body">
        <h3 class="card-nombre">${p.nombre}</h3>
        <p class="card-desc">${p.desc}</p>
        <div class="card-footer">
          <span class="precio">${formatPrecio(p.precio)}</span>
          <button class="btn-agregar" data-id="${p._id}" ${!p.disponible ? "disabled" : ""}>
            ${p.disponible ? "Agregar" : "Agotado"}
          </button>
        </div>
      </div>
    </div>
  `
    )
    .join("");

  grid.querySelectorAll(".btn-agregar:not([disabled])").forEach((btn) => {
    btn.addEventListener("click", () => {
      const prod = todosLosProductos.find((p) => (p._id || p.id) == btn.dataset.id);
      carrito.agregar(prod);
      mostrarToast(`✓ ${prod.nombre} agregado al carrito`);
    });
  });
}

async function init() {
  grid.innerHTML = `<p class="cargando">Cargando...</p>`;
  try {
    todosLosProductos = await api.getProductos();
    const categorias = [...new Set(todosLosProductos.map((p) => p.categoria))];
    renderFiltros(categorias);
    renderProductos(todosLosProductos);
  } catch (e) {
    grid.innerHTML = `<p class="error">Error al cargar. ¿Está corriendo el servidor?</p>`;
  }
}

init();
