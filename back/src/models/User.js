import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    description: "Nombre del usuario"
  },
  lastname: {
    type: String,
    required: true,
    minlength: 1,
    description: "Apellidos del usuario"
  },
  phone: {
    type: String,
    required: true,
    match: /^[0-9]{9}$/, // Validación para un número de 10 dígitos
    description: "Número de teléfono del usuario"
  },
  address: {
    type: String,
    required: true,
    description: "Dirección del usuario"
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Validación de email
    description: "Correo electrónico del usuario"
  },
  password: {
    type: String,
    required: true,
    minlength: 8, // Longitud mínima para seguridad
    description: "Contraseña del usuario (encriptada)"
  },
  birthday: {
    type: Date,
    description: "Fecha de nacimiento del usuario"
  },
  rol: {
    type: String,
    enum: ["admin", "user"], // Roles válidos
    default: "user",
    description: "Rol del usuario en el sistema"
  },
  favoritesGenres: {
    type: [String],
    enum: ['Romance', "Drama", "Terror", "Fantasía", 'Thriller'], // Géneros favoritos permitidos
    description: "Género favorito del usuario"
  },
  photo: {
    type: String,
    description: "URL de la foto del usuario"
  },
  favorites: [{
    _id: false,
    book_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Books',  // Referencia al modelo Books
      required: false
    },
  }]

}, { timestamps: true });

const userModel = mongoose.model('Users', UserSchema, 'Users');

export default userModel;





