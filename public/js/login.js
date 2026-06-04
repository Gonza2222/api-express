// public/js/login.js
import { api } from "./api.js";
import { auth } from "./auth.js";

// Si ya está logueado, redirigir al inicio
if (auth.estaLogueado()) {
  window.location.href = "index.html";
}

const tabLogin = document.getElementById("tab-login");
const tabRegistro = document.getElementById("tab-registro");
const formLogin = document.getElementById("form-login");
const formRegistro = document.getElementById("form-registro");
const errorLogin = document.getElementById("error-login");
const errorRegistro = document.getElementById("error-registro");

// ── Tabs ───────────────────────────────────────────────────────
tabLogin.addEventListener("click", () => {
  tabLogin.classList.add("activo");
  tabRegistro.classList.remove("activo");
  formLogin.style.display = "flex";
  formRegistro.style.display = "none";
  errorLogin.textContent = "";
});

tabRegistro.addEventListener("click", () => {
  tabRegistro.classList.add("activo");
  tabLogin.classList.remove("activo");
  formRegistro.style.display = "flex";
  formLogin.style.display = "none";
  errorRegistro.textContent = "";
});

// ── Login ──────────────────────────────────────────────────────
document.getElementById("btn-login").addEventListener("click", async () => {
  errorLogin.textContent = "";
  const email = document.getElementById("login-email").value.trim();

  if (!email) {
    errorLogin.textContent = "Ingresá tu email.";
    return;
  }

  try {
    const user = await api.buscarUsuarioPorEmail(email);
    auth.guardarUsuario(user);
    // Redirigir al carrito si venía de ahí, sino al inicio
    const destino = sessionStorage.getItem("redirect_after_login") || "index.html";
    sessionStorage.removeItem("redirect_after_login");
    window.location.href = destino;
  } catch (e) {
    errorLogin.textContent = "Email no encontrado. ¿Querés registrarte?";
  }
});

// ── Registro ───────────────────────────────────────────────────
document.getElementById("btn-registro").addEventListener("click", async () => {
  errorRegistro.textContent = "";
  const nombre = document.getElementById("reg-nombre").value.trim();
  const apellido = document.getElementById("reg-apellido").value.trim();
  const email = document.getElementById("reg-email").value.trim();

  if (!nombre || !apellido || !email) {
    errorRegistro.textContent = "Completá todos los campos.";
    return;
  }

  // Verificar que el email no esté en uso
  try {
    await api.buscarUsuarioPorEmail(email);
    errorRegistro.textContent = "Ese email ya está registrado. Iniciá sesión.";
    return;
  } catch (_) {
    // No existe, podemos registrar
  }

  try {
    const nuevoUsuario = await api.registrarUsuario({ nombre, apellido, email, activo: true, es_admin: false });
    auth.guardarUsuario(nuevoUsuario);
    const destino = sessionStorage.getItem("redirect_after_login") || "index.html";
    sessionStorage.removeItem("redirect_after_login");
    window.location.href = destino;
  } catch (e) {
    errorRegistro.textContent = "Error al registrar. Intentá de nuevo.";
  }
});
