TechStore — API Express

E-commerce de productos tecnológicos desarrollado con Node.js, Express y MongoDB Atlas.

Requisitos


Node.js v18 o superior
npm
Cuenta en MongoDB Atlas (gratuita)


Instalación


Clonar el repositorio


bashgit clone https://github.com/Gonza2222/api-express
cd api-express


Instalar dependencias


bashnpm install


Crear el archivo .env en la raíz basándote en .env.example


MONGO_URI=tu_conexión_mongodb_atlas
JWT_SECRET=techstore_secret_2024
PORT=3000


Correr el servidor


bashnode app.js


Abrir en el navegador


http://localhost:3000

Tecnologías


Node.js + Express
MongoDB Atlas + Mongoose
bcryptjs — encriptación de contraseñas
jsonwebtoken — autenticación JWT
HTML/CSS/JS vanilla — frontend


Rutas

Autenticación


POST /registro — registrar usuario nuevo (contraseña encriptada con bcrypt)
POST /login — iniciar sesión, devuelve token JWT


Productos


GET /productos — obtener todos (acepta ?categoria=)
GET /productos/:id — obtener por id
POST /productos — crear producto
PUT /productos/:id — actualizar producto
DELETE /productos/:id — eliminar (valida existencia e integridad con ventas)


Usuarios


GET /usuarios — obtener todos (sin contraseña)
GET /usuarios/:id — obtener por id
GET /usuarios/buscar/email — buscar por email
POST /usuarios — crear usuario


Ventas


GET /ventas — obtener todas
GET /ventas/:id — obtener por id
POST /ventas — crear orden de compra (requiere token JWT)


Estructura del proyecto

api-express/
├── data/           # JSONs originales (respaldo)
├── middleware/
│   └── auth.js     # Verificación JWT
├── models/
│   ├── Producto.js
│   ├── Usuario.js
│   └── Venta.js
├── public/         # Frontend estático
│   ├── index.html
│   ├── categorias.html
│   ├── carrito.html
│   ├── login.html
│   ├── css/
│   └── js/
├── .env.example
├── app.js
└── package.json
