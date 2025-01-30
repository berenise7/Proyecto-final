import React, { useState } from "react";
import styles from "./Cart.module.css";

export default function Cart(props) {
  const { cartRef, cartItems, setCartItems } = props;

  // Estado de ejemplo para los productos del carrito

  // Función para incrementar la cantidad del producto
  const incrementQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 0
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Función para disminuir la cantidad de un producto
  const decrementQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  //Funcion para eliminar productos del carrito
  const removeItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Calcular todo el total
  const calculateTotal = () => {
    return cartItems
      .reduce((acc, item) => acc + item.price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <div className={styles.overlayCart} ref={cartRef}>
      <div className={styles.cartContainer}>
        <h2>Tu cesta</h2>
        {cartItems.length === 0 ? (
          <p>Tu cesta está vacía.</p>
        ) : (
          <div className={styles.cartItems}>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.itemInfo}>
                  <p className={styles.itemName}>{item.name}</p>
                  <p className={styles.itemPrice}>{item.price.toFixed(2)}€</p>
                </div>
                <div className={styles.itemControls}>
                  <button
                    className={styles.quantityButton}
                    onClick={() => decrementQuantity(item.id)}
                  >
                    -
                  </button>
                  <span className={styles.quantity}>{item.quantity}</span>
                  <button
                    className={styles.quantityButton}
                    onClick={() => incrementQuantity(item.id)}
                  >
                    +
                  </button>
                </div>
                <button
                  className={styles.removeButton}
                  onClick={() => removeItem(item.id)}
                >
                  Eliminar
                </button>
              </div>
            ))}
            <div className={styles.cartTotal}>
              <h3>Total: {calculateTotal()}€</h3>
            </div>
          </div>
        )}
      </div>
      <div className={styles.payButtonWrapper}>
        <button className={styles.payButton}>Ir a pagar</button>
      </div>
    </div>
  );
}
