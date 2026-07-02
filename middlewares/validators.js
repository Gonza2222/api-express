import { ApiError } from "./errorHandler.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validarRegistro = (req, res, next) => {
  const { nombre, apellido, email, contraseña } = req.body;
  if (!nombre || !apellido || !email || !contraseña) {
    return next(new ApiError(400, "nombre, apellido, email y contraseña son requeridos"));
  }
  if (!EMAIL_REGEX.test(email)) {
    return next(new ApiError(400, "El email no tiene un formato válido"));
  }
  if (contraseña.length < 6) {
    return next(new ApiError(400, "La contraseña debe tener al menos 6 caracteres"));
  }
  next();
};

export const validarLogin = (req, res, next) => {
  const { email, contraseña } = req.body;
  if (!email || !contraseña) {
    return next(new ApiError(400, "email y contraseña son requeridos"));
  }
  next();
};

export const validarProducto = (req, res, next) => {
  const { nombre, desc, precio, categoria } = req.body;
  if (!nombre || !desc || precio === undefined || !categoria) {
    return next(new ApiError(400, "nombre, desc, precio y categoria son requeridos"));
  }
  if (typeof precio !== "number" || precio < 0) {
    return next(new ApiError(400, "precio debe ser un número mayor o igual a 0"));
  }
  if (req.body.stock !== undefined && (typeof req.body.stock !== "number" || req.body.stock < 0)) {
    return next(new ApiError(400, "stock debe ser un número mayor o igual a 0"));
  }
  next();
};

export const validarProductoUpdate = (req, res, next) => {
  const { precio, stock } = req.body;
  if (precio !== undefined && (typeof precio !== "number" || precio < 0)) {
    return next(new ApiError(400, "precio debe ser un número mayor o igual a 0"));
  }
  if (stock !== undefined && (typeof stock !== "number" || stock < 0)) {
    return next(new ApiError(400, "stock debe ser un número mayor o igual a 0"));
  }
  next();
};

export const validarUsuarioUpdate = (req, res, next) => {
  const { email, contraseña } = req.body;
  if (email !== undefined && !EMAIL_REGEX.test(email)) {
    return next(new ApiError(400, "El email no tiene un formato válido"));
  }
  if (contraseña !== undefined && contraseña.length < 6) {
    return next(new ApiError(400, "La contraseña debe tener al menos 6 caracteres"));
  }
  next();
};

export const validarVenta = (req, res, next) => {
  const { direccion, productos } = req.body;
  if (!direccion) {
    return next(new ApiError(400, "direccion es requerida"));
  }
  if (!Array.isArray(productos) || productos.length === 0) {
    return next(new ApiError(400, "productos debe ser un arreglo con al menos un ítem"));
  }
  for (const item of productos) {
    if (!item.id_producto || !item.cantidad || item.cantidad <= 0) {
      return next(new ApiError(400, "Cada producto requiere id_producto y cantidad mayor a 0"));
    }
  }
  next();
};
