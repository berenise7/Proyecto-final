// Importa la librería de Cloudinary
import {v2 as cloudinary} from "cloudinary";
import path from 'path'
// Configura Cloudinary con las credenciales de tu cuenta
cloudinary.config({
  cloud_name: "dfamhpsoj", // Nombre de tu nube en Cloudinary
  api_key: "552898775265685",       // Clave de API para autenticar tu cuenta
  api_secret: "7fsmo9F_rbbTbR0iUBUTv2WcL1g", // Secreto de API para autenticar tu cuenta
});

const imagePath = path.resolve("src","images", "alas_de_onix.png");

// (async function() {
  
//     const results = await cloudinary.uploader.upload(imagePath);
//     const prueba = await cloudinary.
//     console.log(results);
//     const url = cloudinary.url(results.public_id, {
//       transformation: [
//         {
//           quality: "auto",
//           fetch_format: "auto"
//         },
//         {
//           width : 400,
//           heigh: 600
//         }
//       ]
//     })
//     console.log(url);
    
// })();

// Exporta la configuración de Cloudinary para usarla en otras partes del proyecto
export default cloudinary;
