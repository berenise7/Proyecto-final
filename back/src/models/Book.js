import mongoose from "mongoose";

const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: {
        type: String,
        required: true,
        description: "Título del libro"
    },
    isbn: {
        type: String,
        required: true,
        unique: true,
        description: "Número de identificación único del libro (ISBN)"
    },
    author: {
        type: String,
        required: true,
        description: "Autor del libro"
    },
    genres: {
        type: [String],
        enum: ['Romance', "Drama",  "Terror", "Fantasía", 'Thriller'],
        required: true,
        description: "Generos del libro"
    },
    editorial: {
        type: String,
        required: true,
        description: "Editorial del libro"
    },
    description: {
        type: String,
        required: true,
        description: "Descripción del libro"
    },
    price: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isFinite,
            message: "El precio debe ser un número válido"
        },
        description: "Precio del libro"
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    image: {
        type: String,
        required: false,
        description: "URL de la imagen del libro"
    },
    isNewBook: {
        type: Boolean,
        description: "Es un libro nuevo"
    },
    isPresale: {
        type: Boolean,
        description: "Es un libro en preventa"
    },
    bestSeller: {
        type: Boolean,
        description: "Es uno de los libros mas vendidos"
    },
    isRecommendation: {
        type: Boolean,
        description: "Es uno de los libros recomendados"
    },
    ratings: {
        type: [Number],
        enum: [1, 2, 3, 4, 5]
    },

    url: {
        type: String,
        description: "Url del libro"
    },
    searchField: {
        type: String,
        description: "Campo de busqueda"
    }
}, { timestamps: true })


const bookModel = mongoose.model("Books", bookSchema, "Books");
export default bookModel;