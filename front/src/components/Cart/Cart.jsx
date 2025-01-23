import React from 'react'
import styles from "./Cart.module.css";

export default function Cart() {
  return (
    <div className={styles.overlayCart}>
      <div className={styles.cartContent}>
        <h2>Carrito de compras</h2>
      </div>
    </div>
  )
}
