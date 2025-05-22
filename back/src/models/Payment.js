import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Definición del esquema del pago
const PaymentSchema = new Schema({
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: false
    },
    payment_method: {
        type: String,
        enum: ['credit_card', 'paypal', 'bank_transfer'],
        required: true
    },
    transaction_id: {
        type: String,
        default: function () {
            return 'SIM-' + Math.random().toString(36).substr(2, 9); 
        }
    },
    status: {
        type: String,
        enum: ['pendiente', 'completado', 'fallido'],
        default: 'completado'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Crea el modelo y lo exporta
const paymentModel = mongoose.model("Payments", PaymentSchema, "Payments");
export default paymentModel;