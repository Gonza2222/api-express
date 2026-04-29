# API Express

## Requisitos
- Node.js
- npm

## Instalación y ejecución
```bash
npm install
node app.js
```
El servidor corre en `http://localhost:3000`

## Archivos JSON requeridos
Antes de ejecutar, asegurarse de tener estos archivos en la raíz del proyecto con `[]` adentro:
- `productos.json`
- `usuarios.json`
- `ventas.json`

## Rutas

### Productos
- `GET /productos` — obtener todos
- `GET /productos/:id` — obtener por id
- `POST /productos` — crear producto
- `PUT /productos/:id` — actualizar producto
- `DELETE /productos/:id` — eliminar producto (falla si tiene ventas asociadas)

### Usuarios
- `GET /usuarios` — obtener todos
- `GET /usuarios/:id` — obtener por id
- `POST /usuarios` — crear usuario

### Ventas
- `GET /ventas` — obtener todas
- `GET /ventas/:id` — obtener por id
- `POST /ventas` — crear venta (valida que el usuario exista)
