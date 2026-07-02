# TechStore — API Express

Trabajo práctico integrador de **Aplicaciones Web 2**. E-commerce de productos tecnológicos full stack: API REST con Node.js + Express + MongoDB (arquitectura MVC en capas) y un frontend en HTML/CSS/JS vanilla con Bootstrap 5, que permite explorar productos, filtrar por categoría, comprar (carrito + checkout autenticado) y administrar el catálogo desde un panel de administración.

**Repositorio:** https://github.com/Gonza2222/api-express
**Deploy:** _completar con la URL de Vercel una vez desplegado_

---

## Entidades y relaciones

- **Usuario** — registro/login con contraseña encriptada (bcrypt) y JWT.
- **Producto** — catálogo con categoría, precio, stock y disponibilidad.
- **Venta** — relaciona un **Usuario** (comprador) con uno o más **Productos** (detalle de cantidades y precio unitario al momento de la compra).

Reglas de negocio aplicadas:
- No se puede eliminar un **producto** que tenga ventas asociadas.
- No se puede eliminar un **usuario** que tenga ventas asociadas.
- Al crear una venta se valida que el usuario y **cada** producto referenciado existan; el precio se toma del producto en la base (no del cliente).

---

## Tecnologías

**Backend:** Node.js, Express 5, MongoDB Atlas + Mongoose, JWT (`jsonwebtoken`), `bcryptjs`, `dotenv`.
**Frontend:** HTML5, CSS3 (tema propio), Bootstrap 5 (CDN), JavaScript ES Modules, `localStorage` para sesión/carrito.
**Deploy:** Vercel (funciones serverless).

## Arquitectura

```
api-express/
├── api/index.js        # entrypoint serverless (Vercel)
├── config/db.js         # conexión a MongoDB (cacheada para serverless)
├── controllers/         # lógica de negocio por entidad
├── middlewares/         # auth (JWT), validaciones, manejo de errores
├── models/               # esquemas Mongoose (Usuario, Producto, Venta)
├── routes/                # definición de endpoints por entidad
├── public/                # frontend estático (HTML/CSS/JS + panel admin)
├── scripts/setAdmin.js    # promueve un usuario a administrador
├── app.js                 # configuración de Express (sin listen)
├── server.js               # entrypoint para desarrollo local
└── vercel.json              # config de deploy
```

Manejo de errores centralizado (`middlewares/errorHandler.js`): todas las rutas asincrónicas están envueltas con `asyncHandler`, y un middleware final traduce errores de Mongoose (ID inválido, validación, duplicados) y errores propios (`ApiError`) a respuestas JSON `{ mensaje, detalle }` con el código HTTP correspondiente (400/401/403/404/500).

---

## Instalación local

### 1. Clonar el repositorio

```bash
git clone https://github.com/Gonza2222/api-express
cd api-express
npm install
```

### 2. Variables de entorno

Crear un archivo `.env` en la raíz basándote en `.env.example`:

| Variable | Descripción |
|---|---|
| `MONGO_URI` | Connection string de MongoDB Atlas (o local) |
| `JWT_SECRET` | Clave secreta para firmar los tokens JWT |
| `PORT` | Puerto del servidor local (default 3000) |

### 3. Correr el servidor

```bash
npm start
```

Abrir `http://localhost:3000`.

### 4. Generar un usuario administrador

El registro público siempre crea usuarios con `es_admin: false`. Para acceder al panel de administración (`/admin.html`, gestión de productos), registrate normalmente desde `/login.html` y luego corré:

```bash
npm run seed:admin -- tu-email@ejemplo.com
```

Volvé a iniciar sesión para que el token incluya el rol de administrador.

---

## Deploy en Vercel

1. Importar el repositorio en [vercel.com](https://vercel.com) (framework preset: "Other").
2. Cargar las variables de entorno `MONGO_URI` y `JWT_SECRET` en **Project Settings → Environment Variables**.
3. En MongoDB Atlas, en **Network Access**, agregar `0.0.0.0/0` a la whitelist (las funciones de Vercel no tienen IP fija).
4. Deploy. `vercel.json` redirige todas las rutas a `api/index.js`, que sirve tanto la API como el frontend estático (`public/`) desde la misma función.

---

## Endpoints de la API

### Autenticación
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | /registro | Registra un usuario nuevo (contraseña encriptada) | No |
| POST | /login | Autentica y devuelve un token JWT | No |

### Productos
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | /productos | Lista todos (acepta `?categoria=`) | No |
| GET | /productos/:id | Obtiene uno por ID | No |
| POST | /productos | Crea un producto | JWT + admin |
| PUT | /productos/:id | Actualiza un producto | JWT + admin |
| DELETE | /productos/:id | Elimina (bloqueado si tiene ventas) | JWT + admin |

### Usuarios
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | /usuarios | Lista todos (sin contraseña) | No |
| GET | /usuarios/:id | Obtiene uno por ID | No |
| GET | /usuarios/buscar/email?email= | Busca por email | No |
| POST | /usuarios | Crea un usuario | No |
| PUT | /usuarios/:id | Actualiza (dueño o admin) | JWT |
| DELETE | /usuarios/:id | Elimina (bloqueado si tiene ventas; dueño o admin) | JWT |

### Ventas
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | /ventas | Lista todas | No |
| GET | /ventas/:id | Obtiene una por ID | No |
| POST | /ventas | Crea una orden de compra (valida usuario y productos) | JWT |
| PUT | /ventas/:id | Actualiza dirección/estado de entrega (dueño o admin) | JWT |
| DELETE | /ventas/:id | Elimina (dueño o admin) | JWT |

Todas las rutas devuelven errores en formato `{ "mensaje": "...", "detalle": "..." }` con el status HTTP correspondiente (400 validación, 401 sin token, 403 token inválido o sin permiso, 404 no encontrado, 500 error interno).

---

## Funcionalidades del frontend

- Catálogo de productos con buscador y filtro por categoría.
- Carrito de compras persistido en `localStorage`.
- Registro / login con JWT.
- Checkout autenticado que genera una venta real contra la API.
- Panel de administración (`/admin.html`, solo usuarios `es_admin`) con CRUD completo de productos usando tablas y modales de Bootstrap 5.
