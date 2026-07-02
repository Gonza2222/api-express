import Producto from "../models/Producto.js";
import Venta from "../models/Venta.js";
import { ApiError } from "../middlewares/errorHandler.js";

export const listarProductos = async (req, res) => {
  const filtro = {};
  if (req.query.categoria) filtro.categoria = req.query.categoria;
  const productos = await Producto.find(filtro);
  res.json(productos);
};

export const obtenerProducto = async (req, res, next) => {
  const producto = await Producto.findById(req.params.id);
  if (!producto) return next(new ApiError(404, "Producto no encontrado"));
  res.json(producto);
};

export const crearProducto = async (req, res) => {
  const nuevo = new Producto(req.body);
  await nuevo.save();
  res.status(201).json(nuevo);
};

export const actualizarProducto = async (req, res, next) => {
  const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: "after",
    runValidators: true,
  });
  if (!producto) return next(new ApiError(404, "Producto no encontrado"));
  res.json({ mensaje: "Producto actualizado", producto });
};

export const eliminarProducto = async (req, res, next) => {
  const producto = await Producto.findById(req.params.id);
  if (!producto) return next(new ApiError(404, "Producto no encontrado"));

  const tieneVentas = await Venta.findOne({ "productos.id_producto": req.params.id });
  if (tieneVentas) {
    return next(new ApiError(400, "No se puede eliminar: el producto tiene ventas asociadas"));
  }

  await Producto.findByIdAndDelete(req.params.id);
  res.json({ mensaje: "Producto eliminado" });
};
