// Importa multer para gestionar la carga de archivos
import multer from "multer";
import path from 'path'
// Configuración de multer para almacenar las imágenes temporalmente
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/uploads/'); // Asegúrate de tener esta carpeta creada
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Configura multer con el almacenamiento y filtro de archivos permitidos
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimeType && extName) {
      return cb(null, true);
    } else {
      cb(new Error("Solo se permiten imágenes"));
    }
  },
});

export { upload };
