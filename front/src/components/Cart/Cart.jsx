import React, { useState } from "react";
import Link from "next/link";
import styles from "./Cart.module.css";
import { useCart } from "@/core/contexts/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faTrashCan } from "@fortawesome/free-solid-svg-icons";

export default function Cart(props) {
  const { cartRef } = props;

  // Uso de context
  const {
    cart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    calculateTotal,
    formatPrice,
  } = useCart();

  return (
    <div className={cart.length ? styles.cart : styles.emptyCart} ref={cartRef}>
      <h2>Tu cesta</h2>

      {cart.length === 0 ? (
        <p>Tu cesta está vacía.</p>
      ) : (
        <>
          <ul className={styles.cartList}>
            {cart.map((product) => (
              <li key={product.id} className={styles.cartItem}>
                <Link href={product.url}>
                  <img
                    src={product.image}
                    alt={product.title}
                    className={styles.cartImage}
                  />
                </Link>
                <div className={styles.cartInfo}>
                  <Link href={product.url}>
                    <h3>{product.title}</h3>
                  </Link>
                  <p>{product.author}</p>
                  <p className={styles.price}>{formatPrice(product.price)}€</p>
                  <div className={styles.quantityControls}>
                    <button
                      className={styles.quantityBtn}
                      onClick={() => decrementQuantity(product.id)}
                    >
                      <FontAwesomeIcon icon={faMinus} size="lg" />
                    </button>
                    <span className={styles.quantity}>{product.quantity}</span>
                    <button
                      className={styles.quantityBtn}
                      onClick={() => incrementQuantity(product.id)}
                    >
                      <FontAwesomeIcon icon={faPlus} size="lg" />
                    </button>
                  </div>
                </div>
                <button
                  className={styles.removeBtn}
                  onClick={() => removeFromCart(product.id)}
                >
                  <FontAwesomeIcon icon={faTrashCan} size="lg" />
                </button>
              </li>
            ))}
          </ul>
          <div className={styles.total}>
            Total: {formatPrice(calculateTotal())}€
          </div>

          <button className={styles.checkoutBtn}>
            <Link href="/cart/checkout">Ir a pagar</Link>
          </button>
        </>
      )}
    </div>
  );
}
