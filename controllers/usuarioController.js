import Usuario from "../models/Usuario.js";
import Venta from "../models/Venta.js";
import { ApiError } from "../middlewares/errorHandler.js";

const puedeModificar = (req, idObjetivo) =>
  req.usuario.es_admin || req.usuario.id === idObjetivo;

export const listarUsuarios = async (req, res) => {
  const usuarios = await Usuario.find().select("-contraseña");
  res.json(usuarios);
};

export const buscarPorEmail = async (req, res, next) => {
  const { email } = req.query;
  if (!email) return next(new ApiError(400, "Email requerido"));
  const usuario = await Usuario.findOne({ email: email.toLowerCase() }).select("-contraseña");
  if (!usuario) return next(new ApiError(404, "Usuario no encontrado"));
  res.json(usuario);
};

export const obtenerUsuario = async (req, res, next) => {
  const usuario = await Usuario.findById(req.params.id).select("-contraseña");
  if (!usuario) return next(new ApiError(404, "Usuario no encontrado"));
  res.json(usuario);
};

export const crearUsuario = async (req, res, next) => {
  const { email } = req.body;
  const existe = await Usuario.findOne({ email: email.toLowerCase() });
  if (existe) return next(new ApiError(400, "El email ya está registrado"));

  const nuevo = new Usuario({ ...req.body, email: email.toLowerCase() });
  await nuevo.save();
  const { contraseña, ...seguro } = nuevo.toObject();
  res.status(201).json(seguro);
};

export const actualizarUsuario = async (req, res, next) => {
  if (!puedeModificar(req, req.params.id)) {
    return next(new ApiError(403, "No tenés permiso para modificar este usuario"));
  }

  const usuario = await Usuario.findById(req.params.id);
  if (!usuario) return next(new ApiError(404, "Usuario no encontrado"));

  const camposPermitidos = ["nombre", "apellido", "email", "contraseña", "activo"];
  for (const campo of camposPermitidos) {
    if (req.body[campo] !== undefined) {
      usuario[campo] = campo === "email" ? req.body[campo].toLowerCase() : req.body[campo];
    }
  }
  if (req.usuario.es_admin && req.body.es_admin !== undefined) {
    usuario.es_admin = req.body.es_admin;
  }

  await usuario.save();
  const { contraseña, ...seguro } = usuario.toObject();
  res.json({ mensaje: "Usuario actualizado", usuario: seguro });
};

export const eliminarUsuario = async (req, res, next) => {
  if (!puedeModificar(req, req.params.id)) {
    return next(new ApiError(403, "No tenés permiso para eliminar este usuario"));
  }

  const usuario = await Usuario.findById(req.params.id);
  if (!usuario) return next(new ApiError(404, "Usuario no encontrado"));

  const tieneVentas = await Venta.findOne({ id_usuario: req.params.id });
  if (tieneVentas) {
    return next(new ApiError(400, "No se puede eliminar: el usuario tiene ventas asociadas"));
  }

  await Usuario.findByIdAndDelete(req.params.id);
  res.json({ mensaje: "Usuario eliminado" });
};
