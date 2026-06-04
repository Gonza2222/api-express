import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const usuarioSchema = new mongoose.Schema({
  nombre:     { type: String, required: true },
  apellido:   { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
  activo:     { type: Boolean, default: true },
  es_admin:   { type: Boolean, default: false },
});

// Encriptar contraseña antes de guardar
usuarioSchema.pre("save", async function () {
  if (!this.isModified("contraseña")) return;
  this.contraseña = await bcrypt.hash(this.contraseña, 10);
});

// Método para verificar contraseña
usuarioSchema.methods.verificarContraseña = async function (contraseña) {
  return bcrypt.compare(contraseña, this.contraseña);
};

export default mongoose.model("Usuario", usuarioSchema);
