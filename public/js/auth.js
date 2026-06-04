// public/js/auth.js
import { api } from "./api.js";

const CLAVE_USER = "techstore_usuario";

export const auth = {
  getUsuario() {
    return JSON.parse(localStorage.getItem(CLAVE_USER) || "null");
  },

  guardarUsuario(user) {
    localStorage.setItem(CLAVE_USER, JSON.stringify(user));
  },

  cerrarSesion() {
    localStorage.removeItem(CLAVE_USER);
  },

  estaLogueado() {
    return this.getUsuario() !== null;
  },
};

// Actualiza el nav según si hay sesión activa
export function actualizarNavUsuario() {
  const userNav = document.getElementById("nav-usuario");
  if (!userNav) return;
  const user = auth.getUsuario();
  if (user) {
    userNav.innerHTML = `
      <span class="nav-saludo">👤 ${user.nombre}</span>
      <button class="btn-logout" id="btn-logout">Salir</button>
    `;
    document.getElementById("btn-logout")?.addEventListener("click", () => {
      auth.cerrarSesion();
      window.location.reload();
    });
  } else {
    userNav.innerHTML = `<a href="login.html" class="nav-login">Iniciar sesión</a>`;
  }
}
