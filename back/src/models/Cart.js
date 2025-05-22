import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Definición del esquema del carrito
const CartSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users', // Referencia al modelo de user
        required: false
    },
    books: [
        {
            _id: false,
            book_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Books', // Referencia al modelo Books
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1, // No se puede agregar menos de 1
                default: 1
            },
            price: {
                type: Number,
                required: true,
                min: 0 // El precio no puede ser negativo
            },
            total_price: {
                type: Number,
                required: true
            }
        }
    ],
    subtotal: {
        type: Number,
        required: true,
        default: 0
    },
    state: {
        type: String,
        enum: ['abierto', 'cerrado'], // Estados del carrito
        default: 'abierto'
    },
    creation_date: {
        type: Date,
        default: Date.now
    }
});

// Crea el modelo y lo exporta
const cartModel = mongoose.model("Cart", CartSchema, "Cart");
export default cartModel