// public/js/carritoPage.js
import { api } from "./api.js";
import { carrito, actualizarBadge } from "./carrito.js";
import { auth, actualizarNavUsuario } from "./auth.js";

actualizarBadge();
actualizarNavUsuario();

const listaEl = document.getElementById("carrito-lista");
const totalEl = document.getElementById("carrito-total");
const checkoutSection = document.getElementById("checkout-section");
const confirmacion = document.getElementById("confirmacion");
const vaciarBtn = document.getElementById("btn-vaciar");

function formatPrecio(n) {
  return n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
}

function iconoPorCategoria(cat) {
  const iconos = { Notebooks: "💻", Periféricos: "⌨️", Monitores: "🖥️", Audio: "🎧" };
  return iconos[cat] || "📦";
}

function renderCarrito() {
  const items = carrito.obtener();

  if (items.length === 0) {
    listaEl.innerHTML = `
      <div class="carrito-vacio">
        <span>🛒</span>
        <p>Tu carrito está vacío</p>
        <a href="index.html" class="btn-seguir">Ver productos</a>
      </div>`;
    totalEl.textContent = formatPrecio(0);
    checkoutSection.style.display = "none";
    vaciarBtn.style.display = "none";
    return;
  }

  vaciarBtn.style.display = "inline-flex";

  listaEl.innerHTML = items.map((item) => `
    <div class="carrito-item" data-id="${item.id}">
      <div class="item-info">
        <span class="item-icono">${iconoPorCategoria(item.categoria)}</span>
        <div>
          <p class="item-nombre">${item.nombre}</p>
          <p class="item-precio-unit">${formatPrecio(item.precio)} c/u</p>
        </div>
      </div>
      <div class="item-controles">
        <button class="btn-cantidad" data-accion="restar" data-id="${item.id}">−</button>
        <span class="item-cantidad">${item.cantidad}</span>
        <button class="btn-cantidad" data-accion="sumar" data-id="${item.id}">+</button>
        <span class="item-subtotal">${formatPrecio(item.precio * item.cantidad)}</span>
        <button class="btn-quitar" data-id="${item.id}" title="Quitar">✕</button>
      </div>
    </div>
  `).join("");

  totalEl.textContent = formatPrecio(carrito.total());

  const user = auth.getUsuario();
  if (user) {
    checkoutSection.innerHTML = `
      <div class="checkout-box">
        <h3>Datos de entrega</h3>
        <p class="usuario-info">👤 Comprando como <strong>${user.nombre} ${user.apellido}</strong> — <span class="link-logout" id="link-logout">No soy yo</span></p>
        <div class="form-group">
          <label for="direccion">Dirección de entrega</label>
          <input type="text" id="direccion" class="form-input" placeholder="Ej: Av. Colón 1234, Córdoba" />
        </div>
        <p class="error-msg" id="error-msg"></p>
        <button class="btn-comprar" id="btn-comprar">Confirmar compra</button>
      </div>`;

    document.getElementById("link-logout")?.addEventListener("click", () => {
      auth.cerrarSesion();
      window.location.reload();
    });

    document.getElementById("btn-comprar")?.addEventListener("click", () => comprar(user));
  } else {
    checkoutSection.innerHTML = `
      <div class="checkout-box checkout-login">
        <h3>¿Listo para comprar?</h3>
        <p style="color:var(--text-muted); font-size:0.88rem;">Necesitás iniciar sesión o registrarte para continuar.</p>
        <a href="login.html" class="btn-comprar" style="text-align:center; display:block; text-decoration:none;">
          Iniciar sesión / Registrarse
        </a>
      </div>`;
    sessionStorage.setItem("redirect_after_login", "carrito.html");
  }

  checkoutSection.style.display = "block";

  listaEl.querySelectorAll(".btn-cantidad").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const item = carrito.obtener().find((i) => i.id === id);
      if (btn.dataset.accion === "sumar") {
        carrito.cambiarCantidad(id, item.cantidad + 1);
      } else {
        item.cantidad === 1 ? carrito.quitar(id) : carrito.cambiarCantidad(id, item.cantidad - 1);
      }
      renderCarrito();
      actualizarBadge();
    });
  });

  listaEl.querySelectorAll(".btn-quitar").forEach((btn) => {
    btn.addEventListener("click", () => {
      carrito.quitar(parseInt(btn.dataset.id));
      renderCarrito();
      actualizarBadge();
    });
  });
}

async function comprar(user) {
  const errorEl = document.getElementById("error-msg");
  const btn = document.getElementById("btn-comprar");
  const direccion = document.getElementById("direccion").value.trim();

  if (!direccion) {
    errorEl.textContent = "Ingresá una dirección de entrega.";
    return;
  }

  btn.disabled = true;
  btn.textContent = "Procesando...";

  try {
    const items = carrito.obtener();
    const venta = {
      total: carrito.total(),
      direccion,
      entregado: false,
      productos: items.map((i) => ({
        id_producto: i._id || i.id,
        cantidad: i.cantidad,
        precio_unitario: i.precio,
      })),
    };

    const resultado = await api.crearVenta(venta);
    carrito.vaciar();
    actualizarBadge();

    document.querySelector(".carrito-layout").style.display = "none";
    vaciarBtn.style.display = "none";

    confirmacion.innerHTML = `
      <div class="confirmacion-box">
        <span class="check-icon">✓</span>
        <h2>¡Compra realizada!</h2>
        <p>Hola <strong>${user.nombre}</strong>, tu orden fue registrada correctamente.</p>
        <p class="conf-total">${formatPrecio(resultado.total)}</p>
        <p class="conf-dir">📍 ${resultado.direccion}</p>
        <a href="index.html" class="btn-seguir">Seguir comprando</a>
      </div>`;
    confirmacion.style.display = "flex";
  } catch (err) {
    document.getElementById("error-msg").textContent = err.message || "Error al procesar.";
    btn.disabled = false;
    btn.textContent = "Confirmar compra";
  }
}

vaciarBtn?.addEventListener("click", () => {
  carrito.vaciar();
  renderCarrito();
  actualizarBadge();
});

renderCarrito();
