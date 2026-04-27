# API Express - Entrega

## Rutas

### PRODUCTOS
GET /productos
GET /productos/:id
POST /productos
PUT /productos/:id
DELETE /productos/:id

### USUARIOS
GET /usuarios
GET /usuarios/:id
POST /usuarios

### VENTAS
GET /ventas
GET /ventas/:id
POST /ventas

## Notas
- Se implementa integridad de datos en DELETE de productos
- No se permite eliminar productos asociados a ventas