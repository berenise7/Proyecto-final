import express from 'express'
import { getIdOrders, postOrderAndPayment, newOrderAndPayment } from '../controllers/orderControllers.js';

const orderRouter = express.Router();
// Rutas
// Crear nueva orden y procesar pago
orderRouter.post('/', postOrderAndPayment);
orderRouter.post('/newOrder', newOrderAndPayment);

// Obtener una orden por ID
orderRouter.get('/:id', getIdOrders)

export default orderRouter