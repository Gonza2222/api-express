import { Router } from "express";
import {
  listarUsuarios,
  buscarPorEmail,
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
} from "../controllers/usuarioController.js";
import { validarUsuarioUpdate, validarRegistro } from "../middlewares/validators.js";
import { verificarToken } from "../middlewares/auth.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(listarUsuarios));
// Debe ir ANTES de /:id para no ser interpretada como un id
router.get("/buscar/email", asyncHandler(buscarPorEmail));
router.get("/:id", asyncHandler(obtenerUsuario));
router.post("/", validarRegistro, asyncHandler(crearUsuario));
router.put("/:id", verificarToken, validarUsuarioUpdate, asyncHandler(actualizarUsuario));
router.delete("/:id", verificarToken, asyncHandler(eliminarUsuario));

export default router;
