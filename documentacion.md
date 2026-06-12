# TechStore — Documentación Técnica

## Link al repositorio

[https://github.com/Gonza2222/api-express](https://github.com/Gonza2222/api-express)

---

## Descripción general

TechStore es una aplicación web de e-commerce desarrollada como proyecto integrador de la materia **Aplicaciones Web 2**. Permite a los usuarios explorar productos tecnológicos, filtrarlos por categoría, agregarlos a un carrito de compras y generar órdenes de compra autenticadas.

El proyecto utiliza una arquitectura **monorepo**, donde el backend sirve directamente los archivos estáticos del frontend.

---

## Tecnologías y dependencias

### Backend
| Tecnología | Versión | Uso |
|---|---|---|
| Node.js | v26.x | Entorno de ejecución |
| Express | ^4.x | Framework HTTP |
| Mongoose | ^8.x | ODM para MongoDB |
| MongoDB Atlas | Cloud (M0 Free) | Base de datos no relacional |
| bcryptjs | ^2.x | Encriptación de contraseñas |
| jsonwebtoken | ^9.x | Autenticación con tokens JWT |
| dotenv | ^16.x | Variables de entorno |

### Frontend
| Tecnología | Uso |
|---|---|
| HTML5 | Estructura de las vistas |
| CSS3 | Estilos personalizados |
| JavaScript (ES Modules) | Lógica del cliente |
| localStorage | Persistencia del carrito y sesión |

---

## Estructura del proyecto

```
api-express/
├── data/               # JSONs originales (respaldo)
│   ├── productos.json
│   ├── usuarios.json
│   └── ventas.json
├── middleware/
│   └── auth.js         # Verificación de token JWT
├── models/             # Modelos Mongoose
│   ├── Producto.js
│   ├── Usuario.js      # Incluye bcrypt en pre-save hook
│   └── Venta.js
├── public/             # Frontend estático
│   ├── index.html      # Listado de productos
│   ├── categorias.html # Filtro por categoría
│   ├── carrito.html    # Carrito y checkout
│   ├── login.html      # Login y registro
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── api.js          # Funciones fetch centralizadas
│       ├── auth.js         # Manejo de sesión en localStorage
│       ├── carrito.js      # Lógica del carrito
│       ├── carritoPage.js  # Página del carrito
│       ├── categorias.js   # Filtro de categorías
│       ├── index.js        # Listado de productos
│       └── login.js        # Login y registro
├── .env                # Variables de entorno (no versionado)
├── .gitignore
├── app.js              # Servidor principal
└── package.json
```

---

## Arquitectura utilizada

Se utilizó una arquitectura **monorepo** donde:

- El backend Express expone las rutas API (`/productos`, `/usuarios`, `/ventas`, `/login`, `/registro`)
- El mismo servidor sirve los archivos estáticos de la carpeta `public/` como frontend
- El frontend se comunica con el backend mediante `fetch` centralizado en `api.js`
- La autenticación se maneja con JWT: el token se genera en el login/registro y se almacena en `localStorage`, enviándose en el header `Authorization: Bearer <token>` al crear ventas

---

## Endpoints de la API

### Autenticación
| Método | Ruta | Descripción |
|---|---|---|
| POST | /registro | Registra un nuevo usuario con contraseña encriptada |
| POST | /login | Autentica y devuelve un token JWT |

### Productos
| Método | Ruta | Descripción |
|---|---|---|
| GET | /productos | Lista todos (acepta ?categoria=) |
| GET | /productos/:id | Obtiene uno por ID |
| POST | /productos | Crea un producto nuevo |
| PUT | /productos/:id | Actualiza un producto |
| DELETE | /productos/:id | Elimina (con validación de existencia e integridad) |

### Usuarios
| Método | Ruta | Descripción |
|---|---|---|
| GET | /usuarios | Lista todos (sin contraseña) |
| GET | /usuarios/:id | Obtiene uno por ID |
| GET | /usuarios/buscar/email | Busca por email |
| POST | /usuarios | Crea un usuario |

### Ventas
| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | /ventas | Lista todas | No |
| GET | /ventas/:id | Obtiene una por ID | No |
| POST | /ventas | Crea una orden de compra | ✅ JWT |

---

## Funcionalidades principales

- **Listado de productos** con buscador en tiempo real (por nombre, descripción y categoría)
- **Filtro por categoría** con botones dinámicos generados desde los datos
- **Carrito de compras** persistido en `localStorage` con control de cantidades
- **Registro e inicio de sesión** con contraseñas encriptadas con bcrypt
- **Autenticación JWT** requerida para generar órdenes de compra
- **Base de datos MongoDB** con modelos Mongoose para Producto, Usuario y Venta
- **Protección de rutas**: el `POST /ventas` requiere token válido

---

## Mejoras implementadas respecto a entregas anteriores

- Migración de almacenamiento en archivos JSON a **MongoDB Atlas**
- Encriptación de contraseñas con **bcrypt** (hook pre-save en Mongoose)
- Sistema de **autenticación JWT** con expiración de 24 horas
- Corrección del `DELETE` que devolvía 200 aunque el recurso no existiera
- Reorganización de los archivos JSON en carpeta `/data`
- Agregado de campo `categoria` a productos
- Sistema de login/registro en el frontend para usuarios nuevos
- Validación de email duplicado en el registro

---

## Link al video explicativo

[https://youtu.be/C0ckg7XYl6w](https://youtu.be/C0ckg7XYl6w)


## Reflexiones

**Principales dificultades:**
- Configurar la conexión a MongoDB Atlas desde Windows (problema de DNS)
- Migrar los IDs numéricos de los JSON a ObjectIds de MongoDB en el frontend
- Mantener compatibilidad del carrito con localStorage al cambiar el formato de los IDs

**Aprendizajes obtenidos:**
- Implementación completa de autenticación con JWT y bcrypt
- Uso de Mongoose con esquemas, hooks y métodos personalizados
- Manejo de variables de entorno con dotenv para no exponer credenciales

**Funcionalidades que más disfruté desarrollar:**
- El sistema de autenticación completo de registro a compra
- El diseño del frontend con tema oscuro y animaciones

**Aspectos a mejorar en versiones futuras:**
- Panel de administración para gestionar productos
- Roles diferenciados (admin/usuario)
- Historial de compras por usuario

