import React, { useState, useEffect } from "react";
import products from "@/api/productos";
import styles from "@/components/Home/CardsMenu.module.css";
import { useCart } from "@/core/contexts/CartContext";
import { useFavorites } from "@/core/contexts/FavoritesContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import {
  faHeart as faHeartSolid,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function Recommendations() {
  const { addToCart, formatPrice } = useCart();
  const { favorites, toggleFavorite } = useFavorites();
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar si existe el token
  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    console.log("🔎 Token encontrado:", token);
    setIsAuthenticated(!!token);
  }, []);
  // Detectar el tamaño de la pantalla y ajustar itemsPerPage
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 480) {
        setItemsPerPage(2); // Menos productos en pantallas muy pequeñas
      } else if (window.innerWidth < 768) {
        setItemsPerPage(3); // Menos productos en pantallas pequeñas
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(4); // Productos intermedios en pantallas medianas
      } else {
        setItemsPerPage(5); // Productos por defecto en pantallas grandes
      }
    };

    // Llamar a la función al cargar la página y cada vez que la ventana cambie de tamaño
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);

    // Limpiar el event listener cuando el componente se desmonte
    return () => {
      window.removeEventListener("resize", updateItemsPerPage);
    };
  }, []);

  // Muestra solo los best sellers
  const filteredProducts = products.filter(
    (product) => product.isRecommendation
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <>
      <div className={styles.container}>
        <h2>Recomendaciones</h2>
        <div className={styles.productList}>
          {displayedProducts.map((product, index) => (
            <div className={styles.productCard} key={index}>
              <Link href={`${product.url}/${product.id}`}>
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
                {isAuthenticated ? (
                  <button onClick={() => toggleFavorite(product)}>
                    <FontAwesomeIcon
                      icon={
                        favorites.some((fav) => fav.id === product.id)
                          ? faHeartSolid
                          : faHeart
                      }
                    />
                  </button>
                ) : (
                  ""
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Paginación con flechas e indicadores */}
        <div className={styles.paginationContainer}>
          <button
            className={styles.paginationArrow}
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          <div className={styles.paginationDots}>
            {Array.from({ length: totalPages }, (_, index) => (
              <span
                key={index}
                className={`${styles.paginationDot} ${
                  page === index + 1 ? styles.activeDot : ""
                }`}
                onClick={() => setPage(index + 1)}
              ></span>
            ))}
          </div>

          <button
            className={styles.paginationArrow}
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
    </>
  );
}
