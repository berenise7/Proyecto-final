import React from "react";
import products from "@/api/productos";
import styles from "@/components/Home/CardsMenu.module.css";
import { useCart } from "@/core/contexts/CartContext";
import Link from "next/link";

export default function HomeLiterary() {
  const { addToCart, formatPrice } = useCart();

  // Para elegir solo los roductos isNew
  const filteredProducts = products.filter((product) => product.isNew);

  return (
    <>
      <div className={styles.topSellers}>
        <h2>Novedades</h2>
        <div className={styles.productList}>
          {filteredProducts.map((product, index) => (
            <div className={styles.productCard} key={index}>
              <Link href={product.url}>
                <img src={product.image} alt={product.title} />
                <div className={styles.productInfo}>
                  {product.isNew && <span className={styles.badge}>Nuevo</span>}
                  {product.isPresale && (
                    <span className={styles.badge}>Preventa</span>
                  )}
                  <h3 className={styles.title}>{product.title}</h3>
                  <p className={styles.author}>{product.author}</p>
                  <p>
                    <span className={styles.price}>
                      {formatPrice(product.price)}€
                    </span>
                  </p>
                  {/* <Link href={product.url}>Ver más</Link> */}
                </div>
              </Link>
              {product.quantity >= 1 ? (
                <button onClick={() => addToCart(product)}>
                  Añadir a la cesta
                </button>
              ) : (
                <button>No hay stock</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
