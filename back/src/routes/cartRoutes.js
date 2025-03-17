import express from 'express';
import { addBookToCart, getCart, mergeCart, removeBookFromCart, updateCartItem } from '../controllers/cartControllers.js';

const cartRouter = express.Router();

cartRouter.post("/add", addBookToCart);
cartRouter.get("/:userId", getCart);
cartRouter.post("/merge", mergeCart);
cartRouter.put("/update", updateCartItem);
cartRouter.delete("/remove", removeBookFromCart);

export default cartRouter;