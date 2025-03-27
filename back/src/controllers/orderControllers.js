import cartModel from "../models/Cart.js";
import orderModel from "../models/Order.js";
import paymentModel from "../models/Payment.js";
import { sendEmail } from "../services/emailServices.js";
import { orderConfirmationTemplate } from "../services/templates/orderConfirmation.js";


const newOrderAndPayment = async (req, res) => {
    try {
        const { orderData, paymentData, cartData, userId } = req.body;

        if (!orderData || !paymentData) {
            return res.status(400).json({ status: "failed", error: "Datos inválidos o incompletos." });
        }

        const newOrder = new orderModel({
            user_id: userId,
            books: cartData.map(item => ({
                book_id: item.book_id?._id || item.book_id || item._id,
                quantity: item.quantity,
                price: item.price,
                total_price: item.price * item.quantity
            })),
            subtotal: cartData.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2),
            full_name: orderData.full_name,
            email: orderData.email,
            phone: orderData.phone,
            country: orderData.country,
            city: orderData.city,
            address: orderData.address,
            zip_code: orderData.zip_code,
        })

        await newOrder.save()

        const newPayment = new paymentModel({
            order_id: newOrder._id,
            user_id: userId || null,
            payment_method: paymentData.method,
        })
        await newPayment.save()

        newOrder.status = 'completado';
        await newOrder.save();

        const orderWithBooks = await orderModel.findById(newOrder._id).populate("books.book_id");
        const emailHtml = orderConfirmationTemplate(orderWithBooks, newPayment.payment_method)
        await sendEmail(orderData.email, "Confirmacion de Pedido", emailHtml)

        if (userId) {
            const cart = await cartModel.findOne({ user_id: userId })
            await cartModel.deleteOne({ _id: cart._id });
            return res.status(200).json({
                status: "Succeeded",
                data: null,
                error: null
            });
        }

        return res.status(201).json({
            status: "Succeeded",
            message: "Orden y pago creados exitosamente",
            order: newOrder,
            payment: newPayment
        });
    } catch (error) {
        res
            .status(500)
            .json({ status: "failed", data: null, error: error.message });
    }
}


export { newOrderAndPayment }