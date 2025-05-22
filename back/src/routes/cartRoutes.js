import express from 'express';
import { addBookToCart, getCart, mergeCart, removeBookFromCart, updateCartItem } from '../controllers/cartControllers.js';

const cartRouter = express.Router();
// Rutas
// Obtener carrito de un usuario
cartRouter.get("/:userId", getCart);

// Añadir y actualizar libros en el carrito
cartRouter.post("/add", addBookToCart);
cartRouter.put("/update", updateCartItem);

// Quitar libro del carrito
cartRouter.delete("/remove", removeBookFromCart);

// Fusionar carrito temporal con uno persistente
cartRouter.post("/merge", mergeCart);

export default cartRouter;