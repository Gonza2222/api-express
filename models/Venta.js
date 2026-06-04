import mongoose from "mongoose";

const ventaSchema = new mongoose.Schema({
  id_usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  fecha:      { type: String, required: true },
  total:      { type: Number, required: true },
  direccion:  { type: String, required: true },
  entregado:  { type: Boolean, default: false },
  productos: [
    {
      id_producto:    { type: mongoose.Schema.Types.ObjectId, ref: "Producto" },
      cantidad:       { type: Number, required: true },
      precio_unitario:{ type: Number, required: true },
    },
  ],
});

export default mongoose.model("Venta", ventaSchema);
