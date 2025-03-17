import React, { useState } from "react";
import Link from "next/link";
import styles from "./DropDownCart.module.css";
import { useFavorites } from "@/core/contexts/FavoritesContext";
import { useCart } from "@/core/contexts/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faPlus, faMinus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/core/contexts/AuthContext";

export default function DropDownCart({ cartRef }) {
  // Uso de context
  const {
    cart,
    subtotal,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    calculateTotal,
    formatPrice,
  } = useCart();
  const { favorites, setFavorites } = useFavorites();
  const { user } = useAuth();

  // Función para alternar favoritos
  const toggleFavorite = (product) => {
    setFavorites((prevFavorites) => {
      const isFavorite = prevFavorites.some((fav) => fav._id === product._id);
      if (isFavorite) {
        return prevFavorites.filter((fav) => fav._id !== product._id); // Quitar de favoritos
      } else {
        return [...prevFavorites, product]; // Agregar a favoritos
      }
    });
  };
  console.log(cart);

  return (
    <div className={cart.length ? styles.cart : styles.emptyCart} ref={cartRef}>
      <h2>Tu cesta</h2>

      {cart.length === 0 ? (
        <p>Tu cesta está vacía.</p>
      ) : (
        <>
          <ul className={styles.cartList}>
            {cart.map((product) => (
              <li
                key={product._id || product.book_id._id}
                className={styles.cartItem}
              >
                <Link
                  href={
                    !user
                      ? `${product.url}/${product._id}`
                      : `${product.book_id.url}/${product.book_id._id}`
                  }
                >
                  <img
                    src={product.image || product.book_id.image}
                    alt={product.title || product.book_id.title}
                    className={styles.cartImage}
                  />
                </Link>
                <div className={styles.cartInfo}>
                  <Link
                    href={
                      !user
                      ? `${product.url}/${product._id}`
                      : `${product.book_id.url}/${product.book_id._id}`
                    }
                  >
                    <h3>{product.title || product.book_id.title}</h3>
                  </Link>
                  <p>{product.author || product.book_id.author}</p>
                  <p className={styles.price}>{formatPrice(product.price)}€</p>
                  <div className={styles.quantityControls}>
                    <button
                      className={styles.quantityBtn}
                      onClick={() => decrementQuantity(product.book_id._id)}
                    >
                      <FontAwesomeIcon icon={faMinus} size="lg" />
                    </button>
                    <span className={styles.quantity}>{product.quantity}</span>
                    <button
                      className={styles.quantityBtn}
                      onClick={() => incrementQuantity(product.book_id._id)}
                    >
                      <FontAwesomeIcon icon={faPlus} size="lg" />
                    </button>
                  </div>
                </div>
                <div className={styles.cartActions}>
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeFromCart(product.book_id._id)}
                  >
                    <FontAwesomeIcon icon={faTrashCan} size="lg" />
                  </button>
                  {user && (
                    <button
                      onClick={() => toggleFavorite(product)}
                      className={styles.favButton}
                    >
                      <FontAwesomeIcon
                        icon={
                          favorites.some((fav) => fav._id === product._id)
                            ? faHeartSolid
                            : faHeart
                        }
                      />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <div className={styles.total}>
            Total: {user ? subtotal : formatPrice(calculateTotal())}€
          </div>
          <button className={styles.checkoutBtn}>
            <Link href="/cart/checkout">Ir a pagar</Link>
          </button>
        </>
      )}
    </div>
  );
}
