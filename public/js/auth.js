// public/js/auth.js
const CLAVE_USER = "techstore_usuario";
const CLAVE_TOKEN = "techstore_token";

export const auth = {
  getUsuario() {
    return JSON.parse(localStorage.getItem(CLAVE_USER) || "null");
  },

  getToken() {
    return localStorage.getItem(CLAVE_TOKEN);
  },

  guardarSesion(usuario, token) {
    localStorage.setItem(CLAVE_USER, JSON.stringify(usuario));
    localStorage.setItem(CLAVE_TOKEN, token);
  },

  cerrarSesion() {
    localStorage.removeItem(CLAVE_USER);
    localStorage.removeItem(CLAVE_TOKEN);
  },

  estaLogueado() {
    return this.getToken() !== null;
  },
};

export function actualizarNavUsuario() {
  const userNav = document.getElementById("nav-usuario");
  const adminLink = document.getElementById("nav-admin-link");
  const user = auth.getUsuario();

  if (adminLink) {
    adminLink.style.display = user?.es_admin ? "" : "none";
  }

  if (!userNav) return;
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
