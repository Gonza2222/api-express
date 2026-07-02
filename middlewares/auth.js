import jwt from "jsonwebtoken";
import { ApiError } from "./errorHandler.js";

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return next(new ApiError(401, "Token requerido"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    next(new ApiError(403, "Token inválido o expirado"));
  }
};

export const verificarAdmin = (req, res, next) => {
  if (!req.usuario?.es_admin) {
    return next(new ApiError(403, "Acceso restringido a administradores"));
  }
  next();
};
