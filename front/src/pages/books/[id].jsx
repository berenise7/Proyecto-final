import Header from "@/components/Header/Header";
import { useRouter } from "next/router";
import React, { useState } from "react";
import products from "@/api/productos";
import { useCart } from "@/core/contexts/CartContext";
import styles from "@/pages/books/book.module.css";
import StarRating from "@/components/StarRating/StarRating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

export default function book() {
  const { addToCart, formatPrice } = useCart();
  const router = useRouter();
  const { id } = router.query;

  const [showFull, setShowFull] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Número de caracteres visibles antes de "Ver más"
  const MAX_LENGTH = 300;

  //   Buscar el producto por su id
  const product = products.find((p) => p.url === `/books/${id}`);

  // Si no se encuentra el producto
  if (!product) {
    return <p>Producto no encontrado</p>;
  }

  // Para volver a la página anterior
  const goBack = () => {
    router.back();
  };

  // Para calcular la valoracion total
  const calculateAverageRating = (ratings) => {
    if (ratings.length === 0) return "Sin valoraciones";
    const sum = ratings.reduce((acc, rating) => acc + rating, 0);
    return (sum / ratings.length).toFixed(1);
  };
  const averageRating = calculateAverageRating(product.ratings);

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <a className="link" onClick={goBack}>
          <FontAwesomeIcon icon={faChevronLeft} /> Volver atras
        </a>
        {/* Imagen del libro */}
        <div className={styles.imageContainer}>
          <img
            className={styles.image}
            src={product.image}
            alt={product.title}
          />
        </div>
        {/* Detalles del libro */}
        <div className={styles.details}>
          <div className={styles.details1}>
            <h1 className={styles.title}>{product.title}</h1>
            <p className={styles.author}>{product.author}</p>
            <p className={styles.isbn}>
              {product.editorial} - {product.isbn}
            </p>
            {/* ⭐ Sección de Valoraciones */}
            {/* Si son preventa o nuevos no se muestra las valoraciones */}
            {product.isPreventa == false && product.isNew == false ? (
              <div className={styles.ratings}>
                <StarRating rating={averageRating} />
                <span className={styles.ratingText}>
                  ({product.ratings.length} valoraciones)
                </span>
              </div>
            ) : (
              ""
            )}
            {/* 📖 Descripción */}
            <div>
              <p className={styles.description}>
                <span className="bold">
                  Sipnosis de {product.title} <br />
                </span>
                {showFull
                  ? product.description
                  : `${product.description.slice(0, MAX_LENGTH)}...`}
              </p>
              <p className="link" onClick={() => setShowFull(!showFull)}>
                {showFull ? "Ver menos" : "Ver más"}
              </p>
            </div>
          </div>
          <div className={styles.details2}>
            <p className={styles.price}>{formatPrice(product.price)}€</p>
            {product.quantity >= 1 ? (
              <button
                className={styles.button}
                onClick={() => addToCart(product)}
              >
                Añadir a la cesta
              </button>
            ) : (
              <p>No hay stock</p>
            )}
            <p className={`link ${styles.like}`}>
              <FontAwesomeIcon icon={faHeart} /> Añadir a favoritos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
