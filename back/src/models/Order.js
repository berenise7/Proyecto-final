import mongoose from "mongoose";

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
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
    full_name: {
        type: String,
        required: function () { return !this.user_id }
    },
    email: {
        type: String,
        required: function () { return !this.user_id }
    },
    phone: {
        type: String,
        required: function () { return !this.user_id }
    },
    country: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: function () { return !this.user_id }
    },
    zip_code: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pendiente', 'completado', 'fallido'],
        default: 'pendiente'
    },
});

const orderModel = mongoose.model("Orders", OrderSchema, "Orders");

export default orderModel;