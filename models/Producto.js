import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
  nombre:     { type: String, required: true },
  desc:       { type: String, required: true },
  precio:     { type: Number, required: true },
  imagen:     { type: String },
  stock:      { type: Number, default: 0 },
  disponible: { type: Boolean, default: true },
  categoria:  { type: String, required: true },
});

export default mongoose.model("Producto", productoSchema);
