// Importa multer para gestionar la carga de archivos
import multer from "multer";
// Importa el almacenamiento de Cloudinary con Multer
import { CloudinaryStorage } from "multer-storage-cloudinary";
// Importa la configuración de Cloudinary
import cloudinary from "../config/cloudinary.js";

// Configura el almacenamiento para Multer usando Cloudinary
const storage = new CloudinaryStorage({
  cloudinary, // Usa la configuración de Cloudinary
  params: {
    folder: "imagenes",  // La carpeta en Cloudinary donde se almacenarán las imágenes
    allowed_formats: ["jpg", "png", "jpeg"], // Los formatos de imagen permitidos
  },
});

// Crea el middleware de Multer que usará el almacenamiento de Cloudinary
const upload = multer({ storage });

// Exporta el middleware para usarlo en las rutas
export default upload;
