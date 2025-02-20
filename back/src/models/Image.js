// Importa mongoose para definir el esquema y el modelo
import mongoose from "mongoose";

// Define el esquema de la imagen
const imageSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true }, // La URL de la imagen que se sube
});

// Crea el modelo a partir del esquema
const Image = mongoose.model("Image", imageSchema);

// Exporta el modelo para usarlo en otras partes del proyecto
export default Image;
