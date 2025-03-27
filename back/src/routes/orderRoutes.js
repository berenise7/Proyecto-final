import express from 'express'
import { newOrderAndPayment } from '../controllers/orderControllers.js';

const orderRouter = express.Router();

orderRouter.post('/newOrder', newOrderAndPayment)

export default orderRouter