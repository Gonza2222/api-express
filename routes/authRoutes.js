import { Router } from "express";
import { login, registro } from "../controllers/authController.js";
import { validarLogin, validarRegistro } from "../middlewares/validators.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const router = Router();

router.post("/login", validarLogin, asyncHandler(login));
router.post("/registro", validarRegistro, asyncHandler(registro));

export default router;
