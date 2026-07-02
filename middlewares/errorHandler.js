export class ApiError extends Error {
  constructor(status, mensaje) {
    super(mensaje);
    this.status = status;
  }
}

export const notFound = (req, res, next) => {
  next(new ApiError(404, `Ruta no encontrada: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let mensaje = err.message || "Error interno del servidor";

  if (err.name === "CastError") {
    status = 400;
    mensaje = `ID inválido: ${err.value}`;
  }

  if (err.name === "ValidationError") {
    status = 400;
    mensaje = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  if (err.code === 11000) {
    status = 400;
    const campo = Object.keys(err.keyValue || {})[0];
    mensaje = `Ya existe un registro con ese ${campo || "valor"}`;
  }

  if (status === 500) {
    console.error(err);
  }

  res.status(status).json({
    mensaje,
    detalle: status === 500 ? undefined : err.detalle,
  });
};
