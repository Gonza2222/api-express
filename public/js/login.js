// public/js/login.js
import { api } from "./api.js";
import { auth } from "./auth.js";

if (auth.estaLogueado()) {
  window.location.href = "index.html";
}

const tabLogin = document.getElementById("tab-login");
const tabRegistro = document.getElementById("tab-registro");
const formLogin = document.getElementById("form-login");
const formRegistro = document.getElementById("form-registro");
const errorLogin = document.getElementById("error-login");
const errorRegistro = document.getElementById("error-registro");

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
  const contraseña = document.getElementById("login-password").value;

  if (!email || !contraseña) {
    errorLogin.textContent = "Completá todos los campos.";
    return;
  }

  try {
    const { token, usuario } = await api.login(email, contraseña);
    auth.guardarSesion(usuario, token);
    const destino = sessionStorage.getItem("redirect_after_login") || "index.html";
    sessionStorage.removeItem("redirect_after_login");
    window.location.href = destino;
  } catch (e) {
    errorLogin.textContent = e.message;
  }
});

// ── Registro ───────────────────────────────────────────────────
document.getElementById("btn-registro").addEventListener("click", async () => {
  errorRegistro.textContent = "";
  const nombre = document.getElementById("reg-nombre").value.trim();
  const apellido = document.getElementById("reg-apellido").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const contraseña = document.getElementById("reg-password").value;

  if (!nombre || !apellido || !email || !contraseña) {
    errorRegistro.textContent = "Completá todos los campos.";
    return;
  }

  try {
    const { token, usuario } = await api.registro({ nombre, apellido, email, contraseña });
    auth.guardarSesion(usuario, token);
    const destino = sessionStorage.getItem("redirect_after_login") || "index.html";
    sessionStorage.removeItem("redirect_after_login");
    window.location.href = destino;
  } catch (e) {
    errorRegistro.textContent = e.message;
  }
});
