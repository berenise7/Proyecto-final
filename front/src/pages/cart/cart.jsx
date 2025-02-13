import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "@/core/contexts/CartContext";
import styles from "./cart.module.css";
import Header from "@/components/Header/Header";

export default function cart() {
  const { cart, removeFromCart, calculateTotal, formatPrice } = useCart();
    const router = useRouter();
  
    const goBack = () => {
      router.back();
    };
  return (
    <div>
      <Header />
      <div className={styles.cartContainer}>
         <a className="back" onClick={goBack}>
                  <FontAwesomeIcon icon={faChevronLeft} /> Volver atras
                </a>
        <h2>Carrito de compras</h2>
        <div className={styles.cartContent}>
          {cart.length === 0 ? (
            <p>Tu carrito está vacío</p>
          ) : (
            <div className={styles.cartItems}>
              <ul>
                {cart.map((product) => (
                  <li key={product.id} className={styles.cartItem}>
                    <span>
                      {product.title} x{product.quantity}
                    </span>
                    <div className={styles.priceActions}>
                      <span>
                        {formatPrice(product.price * product.quantity)}€
                      </span>
                      <div className={styles.cartActions}>
                        <button
                          className={styles.removeBtn}
                          onClick={() => removeFromCart(product.id)}
                        >
                          <FontAwesomeIcon icon={faTrashCan} size="lg" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className={styles.cartSummary}>
                <h3>Total: {formatPrice(calculateTotal())}€</h3>
                <div className={styles.cartActions}>
                  <Link href="/cart/checkout">
                    <button className={styles.checkoutBtn}>Ir a pagar</button>
                  </Link>
                  <Link href="/">
                    <button className={styles.continueShoppingBtn}>
                      Seguir comprando
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
