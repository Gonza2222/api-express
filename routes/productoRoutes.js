import { Router } from "express";
import {
  listarProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "../controllers/productoController.js";
import { validarProducto, validarProductoUpdate } from "../middlewares/validators.js";
import { verificarToken, verificarAdmin } from "../middlewares/auth.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(listarProductos));
router.get("/:id", asyncHandler(obtenerProducto));
router.post("/", verificarToken, verificarAdmin, validarProducto, asyncHandler(crearProducto));
router.put("/:id", verificarToken, verificarAdmin, validarProductoUpdate, asyncHandler(actualizarProducto));
router.delete("/:id", verificarToken, verificarAdmin, asyncHandler(eliminarProducto));

export default router;
