import React, { useState } from "react";
import Link from "next/link";
import styles from "./DropDownCart.module.css";
import { useFavorites } from "@/core/contexts/FavoritesContext";
import { useCart } from "@/core/contexts/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faPlus, faMinus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";

export default function DropDownCart({ cartRef }) {
  // Uso de context
  const {
    cart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    calculateTotal,
    formatPrice,
  } = useCart();
  const { favorites, setFavorites } = useFavorites();

  // Función para alternar favoritos
  const toggleFavorite = (product) => {
    setFavorites((prevFavorites) => {
      const isFavorite = prevFavorites.some((fav) => fav.id === product.id);
      if (isFavorite) {
        return prevFavorites.filter((fav) => fav.id !== product.id); // Quitar de favoritos
      } else {
        return [...prevFavorites, product]; // Agregar a favoritos
      }
    });
  };
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
                <Link href={`${product.url}/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.title}
                    className={styles.cartImage}
                  />
                </Link>
                <div className={styles.cartInfo}>
                  <Link href={`${product.url}/${product.id}`}>
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
                <div className={styles.cartActions}>
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeFromCart(product.id)}
                  >
                    <FontAwesomeIcon icon={faTrashCan} size="lg" />
                  </button>
                  <button
                    onClick={() => toggleFavorite(product)}
                    className={styles.favButton}
                  >
                    <FontAwesomeIcon
                      icon={
                        favorites.some((fav) => fav.id === product.id)
                          ? faHeartSolid
                          : faHeart
                      }
                    />
                  </button>
                </div>
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
