// public/js/carritoPage.js
import { api } from "./api.js";
import { carrito, actualizarBadge } from "./carrito.js";

actualizarBadge();

const listaEl = document.getElementById("carrito-lista");
const totalEl = document.getElementById("carrito-total");
const checkoutForm = document.getElementById("checkout-form");
const btnComprar = document.getElementById("btn-comprar");
const confirmacion = document.getElementById("confirmacion");
const errorMsg = document.getElementById("error-msg");
const vaciarBtn = document.getElementById("btn-vaciar");

function formatPrecio(n) {
  return n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
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
    checkoutForm.style.display = "none";
    vaciarBtn.style.display = "none";
    return;
  }

  checkoutForm.style.display = "block";
  vaciarBtn.style.display = "inline-flex";

  listaEl.innerHTML = items
    .map(
      (item) => `
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
  `
    )
    .join("");

  totalEl.textContent = formatPrecio(carrito.total());

  // Eventos cantidad
  listaEl.querySelectorAll(".btn-cantidad").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const item = carrito.obtener().find((i) => i.id === id);
      if (btn.dataset.accion === "sumar") {
        carrito.cambiarCantidad(id, item.cantidad + 1);
      } else {
        if (item.cantidad === 1) {
          carrito.quitar(id);
        } else {
          carrito.cambiarCantidad(id, item.cantidad - 1);
        }
      }
      renderCarrito();
      actualizarBadge();
    });
  });

  // Eventos quitar
  listaEl.querySelectorAll(".btn-quitar").forEach((btn) => {
    btn.addEventListener("click", () => {
      carrito.quitar(parseInt(btn.dataset.id));
      renderCarrito();
      actualizarBadge();
    });
  });
}

function iconoPorCategoria(cat) {
  const iconos = { Notebooks: "💻", Periféricos: "⌨️", Monitores: "🖥️", Audio: "🎧" };
  return iconos[cat] || "📦";
}

vaciarBtn?.addEventListener("click", () => {
  carrito.vaciar();
  renderCarrito();
  actualizarBadge();
});

btnComprar?.addEventListener("click", async () => {
  errorMsg.textContent = "";
  const email = document.getElementById("email").value.trim();
  const direccion = document.getElementById("direccion").value.trim();

  if (!email || !direccion) {
    errorMsg.textContent = "Por favor completá todos los campos.";
    return;
  }

  const items = carrito.obtener();
  if (items.length === 0) {
    errorMsg.textContent = "El carrito está vacío.";
    return;
  }

  btnComprar.disabled = true;
  btnComprar.textContent = "Procesando...";

  try {
    // 1. Buscar usuario por email
    const usuario = await api.buscarUsuarioPorEmail(email);

    // 2. Armar la venta
    const venta = {
      id_usuario: usuario.id,
      fecha: new Date().toISOString().split("T")[0],
      total: carrito.total(),
      direccion,
      entregado: false,
      productos: items.map((i) => ({
        id_producto: i.id,
        cantidad: i.cantidad,
        precio_unitario: i.precio,
      })),
    };

    // 3. Crear venta en el backend
    const resultado = await api.crearVenta(venta);

    // 4. Vaciar carrito y mostrar confirmación
    carrito.vaciar();
    actualizarBadge();
    checkoutForm.style.display = "none";
    listaEl.style.display = "none";
    document.querySelector(".total-box").style.display = "none";
    vaciarBtn.style.display = "none";

    confirmacion.innerHTML = `
      <div class="confirmacion-box">
        <span class="check-icon">✓</span>
        <h2>¡Compra realizada!</h2>
        <p>Hola <strong>${usuario.nombre}</strong>, tu orden <strong>#${resultado.id}</strong> fue registrada correctamente.</p>
        <p class="conf-total">Total: ${formatPrecio(resultado.total)}</p>
        <p class="conf-dir">📍 ${resultado.direccion}</p>
        <a href="index.html" class="btn-seguir">Seguir comprando</a>
      </div>`;
    confirmacion.style.display = "flex";
  } catch (err) {
    errorMsg.textContent = err.message || "Error al procesar la compra.";
    btnComprar.disabled = false;
    btnComprar.textContent = "Confirmar compra";
  }
});

renderCarrito();
