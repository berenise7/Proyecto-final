import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Definición del esquema del reading journal
const ReadingJournalSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Referencia al modelo User
        required: true
    },
    book_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',  // Referencia al modelo Book
        required: false
    },
    image: {
        type: String,
        description: "URL de la imagen del libro"
    },
    title: {
        type: String,
        description: "Título del libro"
    },
    author: {
        type: String,
        description: "Autor del libro"
    },

    pages: {
        type: Number,
        required: false,
        default: 0,
        description: "Total del páginas que tiene el libro"
    },
    start_date: {
        type: Date,
        description: "Fecha cuando has empezado el  libro"
    },
    end_date: {
        type: Date,
        description: "Fecha cuando has acabado el  libro"
    },
    format: {
        type: String,
        enum: ['Fisico', 'Digital', 'AudioLibro'],
        description: "Formato del libro"
    },
    type: {
        type: String,
        enum: ["autoconclusivo", "bilogia", "trilogia", "saga"],
        description: "Tipo de libro",
    },
    rating: {
        type: Number,
        required: true,
        min: 0, // La estrella mínima es 0
        max: 5, // La estrella máxima es 5
        validate: {
            validator: function (value) {
                return Number.isInteger(value);
            },
            message: 'El número de estrellas debe ser un valor entero entre 0 y 5'
        },
        description: 'Estrellas del 0 al 5'
    },
    romantic: {
        type: Number,
        required: true,
        min: 0, // La estrella mínima es 0
        max: 5, // La estrella máxima es 5
        validate: {
            validator: function (value) {
                return Number.isInteger(value);
            },
            message: 'El número de corazones debe ser un valor entero entre 0 y 5'
        },
        description: 'Corazones del 0 al 5'
    },
    happy: {
        type: Number,
        required: true,
        min: 0, // La estrella mínima es 0
        max: 5, // La estrella máxima es 5
        validate: {
            validator: function (value) {
                return Number.isInteger(value);
            },
            message: 'El número de caras felicies debe ser un valor entero entre 0 y 5'
        },
        description: 'Caras felices del 0 al 5'
    },
    sad: {
        type: Number,
        required: true,
        min: 0, // La estrella mínima es 0
        max: 5, // La estrella máxima es 5
        validate: {
            validator: function (value) {
                return Number.isInteger(value);
            },
            message: 'El número de lágrimas debe ser un valor entero entre 0 y 5'
        },
        description: 'Lágrimas del 0 al 5'
    },
    spicy: {
        type: Number,
        required: true,
        min: 0, // La estrella mínima es 0
        max: 5, // La estrella máxima es 5
        validate: {
            validator: function (value) {
                return Number.isInteger(value);
            },
            message: 'El número de guindillas debe ser un valor entero entre 0 y 5'
        },
        description: 'Guindillas del 0 al 5'
    },
    plot: {
        type: Number,
        required: true,
        min: 0, // La estrella mínima es 0
        max: 5, // La estrella máxima es 5
        validate: {
            validator: function (value) {
                return Number.isInteger(value);
            },
            message: 'El número de plot twist debe ser un valor entero entre 0 y 5'
        },
        description: 'Circulos del 0 al 5'
    },
    characters: {
        type: String,
        description: "Nombres de los personajes"
    },
    playlist: {
        type: String,
        required: false,
        description: "Canciones que escuchaste con el libro"
    },
    favoriteMoments: {
        type: String,
        required: false,
        description: "Momentos favoritos del libro"
    },


}, { timestamps: true });

// Crea el modelo y lo exporta
const journalModel = mongoose.model('Journal', ReadingJournalSchema, 'Journal');
export default journalModel;