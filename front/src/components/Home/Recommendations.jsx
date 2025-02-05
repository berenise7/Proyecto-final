import React from "react";
import products from "@/api/productos";
import styles from "@/components/Home/CardsMenu.module.css";
import { useCart } from "@/core/contexts/CartContext";
import { useFavorites } from "@/core/contexts/FavoritesContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function Recommendations() {
  const { addToCart, formatPrice } = useCart();
  const { favorites, toggleFavorite } = useFavorites();

  // Muestra solo los best sellers
  const filteredProducts = products.filter((product) => product.isRecommendation);

  return (
    <>
      <div className={styles.topSellers}>
        <h2>Recomendaciones</h2>
        <div className={styles.productList}>
          {filteredProducts.map((product, index) => (
            <div className={styles.productCard} key={index}>
              <Link href={product.url}>
                <img src={product.image} alt={product.title} />
                <div className={styles.productInfo}>
                  {product.quantity >= 1 ? (
                    (product.isNew && (
                      <span className={styles.badge}>Nuevo</span>
                    )) ||
                    (product.isPresale && (
                      <span className={styles.badge}>Preventa</span>
                    ))
                  ) : (
                    <span className={styles.badge}>Sin stock</span>
                  )}
                  <h3 className={styles.title}>{product.title}</h3>
                  <p className={styles.author}>{product.author}</p>
                  <p>
                    <span className={styles.price}>
                      {formatPrice(product.price)}€
                    </span>
                  </p>
                  <p>{product.cover}</p>
                  {/* <Link href={product.url}>Ver más</Link> */}
                </div>
              </Link>
              <div className={styles.actions}>
                {product.quantity >= 1 ? (
                  <button onClick={() => addToCart(product)}>Añadir</button>
                ) : (
                  ""
                )}
                <button onClick={() => toggleFavorite(product)}>
                  <FontAwesomeIcon
                    icon={
                      favorites.some((fav) => fav.id === product.id)
                        ? faHeartSolid
                        : faHeart
                    }
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}