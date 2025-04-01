import express from 'express'
import { getIdOrders, getOrderAndPayment, newOrderAndPayment } from '../controllers/orderControllers.js';

const orderRouter = express.Router();

orderRouter.post('/', getOrderAndPayment);
orderRouter.post('/newOrder', newOrderAndPayment);
orderRouter.get('/:id', getIdOrders)

export default orderRouter