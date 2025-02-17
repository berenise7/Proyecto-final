import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart as faHeartSolid,
  faTrashCan,
  faChevronLeft,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";

import { useCart } from "@/core/contexts/CartContext";
import { useFavorites } from "@/core/contexts/FavoritesContext";
import styles from "./cart.module.css";
import Header from "@/components/Header/Header";

export default function cart() {
  const {
    cart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    calculateTotal,
    formatPrice,
  } = useCart();
  const { favorites, setFavorites } = useFavorites();
  const router = useRouter();

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
                      <p className={styles.price}>
                        {formatPrice(product.price)}€
                      </p>
                      <div className={styles.quantityControls}>
                        <button
                          className={styles.quantityBtn}
                          onClick={() => decrementQuantity(product.id)}
                        >
                          <FontAwesomeIcon icon={faMinus} size="lg" />
                        </button>
                        <span className={styles.quantity}>
                          {product.quantity}
                        </span>
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
