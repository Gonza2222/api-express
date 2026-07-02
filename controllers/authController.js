import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";
import { ApiError } from "../middlewares/errorHandler.js";

const generarToken = (usuario) =>
  jwt.sign(
    {
      id: usuario._id,
      email: usuario.email,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      es_admin: usuario.es_admin,
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

const usuarioSeguro = (usuario) => ({
  id: usuario._id,
  nombre: usuario.nombre,
  apellido: usuario.apellido,
  email: usuario.email,
  es_admin: usuario.es_admin,
});

export const login = async (req, res, next) => {
  const { email, contraseña } = req.body;

  const usuario = await Usuario.findOne({ email: email.toLowerCase() });
  if (!usuario) return next(new ApiError(404, "Usuario no encontrado"));

  const valido = await usuario.verificarContraseña(contraseña);
  if (!valido) return next(new ApiError(401, "Contraseña incorrecta"));

  res.json({ token: generarToken(usuario), usuario: usuarioSeguro(usuario) });
};

export const registro = async (req, res, next) => {
  const { nombre, apellido, email, contraseña } = req.body;

  const existe = await Usuario.findOne({ email: email.toLowerCase() });
  if (existe) return next(new ApiError(400, "El email ya está registrado"));

  const nuevo = new Usuario({
    nombre,
    apellido,
    email: email.toLowerCase(),
    contraseña,
    activo: true,
    es_admin: false,
  });
  await nuevo.save();

  res.status(201).json({ token: generarToken(nuevo), usuario: usuarioSeguro(nuevo) });
};
