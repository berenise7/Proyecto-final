// Importa la librería de Cloudinary
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv"
import path from "path"
dotenv.config({ path: path.resolve("src", ".env") })

// Configura Cloudinary con las credenciales de tu cuenta
cloudinary.config({
  cloud_name: "dfamhpsoj", // Nombre de tu nube en Cloudinary
  api_key: process.env.API_KEY,       // Clave de API para autenticar tu cuenta
  api_secret: process.env.API_SECRET, // Secreto de API para autenticar tu cuenta
});



// Exporta la configuración de Cloudinary para usarla en otras partes del proyecto
export default cloudinary;
