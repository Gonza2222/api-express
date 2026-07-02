import { Router } from "express";
import {
  listarVentas,
  obtenerVenta,
  crearVenta,
  actualizarVenta,
  eliminarVenta,
} from "../controllers/ventaController.js";
import { validarVenta } from "../middlewares/validators.js";
import { verificarToken } from "../middlewares/auth.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(listarVentas));
router.get("/:id", asyncHandler(obtenerVenta));
router.post("/", verificarToken, validarVenta, asyncHandler(crearVenta));
router.put("/:id", verificarToken, asyncHandler(actualizarVenta));
router.delete("/:id", verificarToken, asyncHandler(eliminarVenta));

export default router;
