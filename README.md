# TechStore - API Express

E-commerce de productos tecnologicos desarrollado con Node.js, Express y MongoDB Atlas.

## Requisitos

- Node.js v18 o superior
- npm
- Cuenta en MongoDB Atlas (gratuita)

## Instalacion

### 1. Clonar el repositorio

```bash
git clone https://github.com/Gonza2222/api-express
cd api-express
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raiz basandote en `.env.example`:

```
MONGO_URI=tu_conexion_mongodb_atlas
JWT_SECRET=techstore_secret_2024
PORT=3000
```

### 4. Correr el servidor

```bash
node app.js
```

### 5. Abrir en el navegador

```
http://localhost:3000
```

## Tecnologias

- Node.js + Express
- MongoDB Atlas + Mongoose
- bcryptjs
- jsonwebtoken
- HTML + CSS + JavaScript vanilla

## Rutas de la API

### Autenticacion

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| POST | /registro | Registrar usuario nuevo |
| POST | /login | Iniciar sesion, devuelve token JWT |

### Productos

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | /productos | Obtener todos |
| GET | /productos/:id | Obtener por id |
| POST | /productos | Crear producto |
| PUT | /productos/:id | Actualizar producto |
| DELETE | /productos/:id | Eliminar producto |

### Usuarios

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | /usuarios | Obtener todos |
| GET | /usuarios/:id | Obtener por id |
| GET | /usuarios/buscar/email | Buscar por email |
| POST | /usuarios | Crear usuario |

### Ventas

| Metodo | Ruta | Descripcion | Auth |
|--------|------|-------------|------|
| GET | /ventas | Obtener todas | No |
| GET | /ventas/:id | Obtener por id | No |
| POST | /ventas | Crear orden de compra | JWT |

## Estructura del proyecto

```
api-express/
├── data/
├── middleware/
│   └── auth.js
├── models/
│   ├── Producto.js
│   ├── Usuario.js
│   └── Venta.js
├── public/
│   ├── index.html
│   ├── categorias.html
│   ├── carrito.html
│   ├── login.html
│   ├── css/
│   └── js/
├── .env.example
├── app.js
└── package.json
```