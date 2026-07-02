// public/js/index.js
import { api } from "./api.js";
import { carrito, actualizarBadge } from "./carrito.js";
import { actualizarNavUsuario } from "./auth.js";

actualizarBadge();
actualizarNavUsuario();

const grid = document.getElementById("productos-grid");
const busqueda = document.getElementById("busqueda");
const toast = document.getElementById("toast");

let todosLosProductos = [];

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

function renderProductos(lista) {
  if (lista.length === 0) {
    grid.innerHTML = `<p class="sin-resultados">No se encontraron productos.</p>`;
    return;
  }
  grid.innerHTML = lista.map((p) => `
    <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
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
    </div>
  `).join("");

  grid.querySelectorAll(".btn-agregar:not([disabled])").forEach((btn) => {
    btn.addEventListener("click", () => {
      const prod = todosLosProductos.find((p) => (p._id || p.id) == btn.dataset.id);
      carrito.agregar(prod);
      mostrarToast(`✓ ${prod.nombre} agregado al carrito`);
      btn.classList.add("agregado");
      setTimeout(() => btn.classList.remove("agregado"), 600);
    });
  });
}

function filtrar() {
  const q = busqueda.value.toLowerCase().trim();
  if (q === "") {
    renderProductos(todosLosProductos);
    return;
  }
  renderProductos(
    todosLosProductos.filter((p) =>
      p.nombre.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q) ||
      p.categoria.toLowerCase().includes(q)
    )
  );
}

busqueda.addEventListener("input", filtrar);
busqueda.addEventListener("keyup", filtrar);

async function init() {
  grid.innerHTML = `<p class="cargando">Cargando productos...</p>`;
  try {
    todosLosProductos = await api.getProductos();
    renderProductos(todosLosProductos);
  } catch (e) {
    grid.innerHTML = `<p class="error">Error al cargar productos. ¿Está corriendo el servidor?</p>`;
  }
}

init();
