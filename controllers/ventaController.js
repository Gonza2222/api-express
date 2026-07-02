import Venta from "../models/Venta.js";
import Producto from "../models/Producto.js";
import Usuario from "../models/Usuario.js";
import { ApiError } from "../middlewares/errorHandler.js";

const puedeModificar = (req, venta) =>
  req.usuario.es_admin || req.usuario.id === venta.id_usuario.toString();

export const listarVentas = async (req, res) => {
  const ventas = await Venta.find()
    .populate("id_usuario", "nombre apellido email")
    .populate("productos.id_producto", "nombre categoria");
  res.json(ventas);
};

export const obtenerVenta = async (req, res, next) => {
  const venta = await Venta.findById(req.params.id)
    .populate("id_usuario", "nombre apellido email")
    .populate("productos.id_producto", "nombre categoria");
  if (!venta) return next(new ApiError(404, "Venta no encontrada"));
  res.json(venta);
};

export const crearVenta = async (req, res, next) => {
  const usuario = await Usuario.findById(req.usuario.id);
  if (!usuario) return next(new ApiError(400, "El usuario no existe"));

  const { direccion, productos } = req.body;

  const idsProductos = productos.map((p) => p.id_producto);
  const productosDb = await Producto.find({ _id: { $in: idsProductos } });

  if (productosDb.length !== idsProductos.length) {
    return next(new ApiError(404, "Uno o más productos de la venta no existen"));
  }

  const productosVenta = productos.map((item) => {
    const productoDb = productosDb.find((p) => p._id.toString() === item.id_producto);
    return {
      id_producto: productoDb._id,
      cantidad: item.cantidad,
      precio_unitario: productoDb.precio,
    };
  });

  const total = productosVenta.reduce((acc, p) => acc + p.precio_unitario * p.cantidad, 0);

  const nueva = new Venta({
    id_usuario: req.usuario.id,
    direccion,
    productos: productosVenta,
    total,
    entregado: false,
    fecha: new Date().toISOString().split("T")[0],
  });
  await nueva.save();
  res.status(201).json(nueva);
};

export const actualizarVenta = async (req, res, next) => {
  const venta = await Venta.findById(req.params.id);
  if (!venta) return next(new ApiError(404, "Venta no encontrada"));
  if (!puedeModificar(req, venta)) {
    return next(new ApiError(403, "No tenés permiso para modificar esta venta"));
  }

  const camposPermitidos = ["direccion", "entregado"];
  for (const campo of camposPermitidos) {
    if (req.body[campo] !== undefined) venta[campo] = req.body[campo];
  }
  await venta.save();
  res.json({ mensaje: "Venta actualizada", venta });
};

export const eliminarVenta = async (req, res, next) => {
  const venta = await Venta.findById(req.params.id);
  if (!venta) return next(new ApiError(404, "Venta no encontrada"));
  if (!puedeModificar(req, venta)) {
    return next(new ApiError(403, "No tenés permiso para eliminar esta venta"));
  }

  await Venta.findByIdAndDelete(req.params.id);
  res.json({ mensaje: "Venta eliminada" });
};
