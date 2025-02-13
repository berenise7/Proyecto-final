import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "@/components/Header/Header";
import StarRating from "@/components/StarRating/StarRating";
import products from "@/api/productos";
import { useCart } from "@/core/contexts/CartContext";
import { useFavorites } from "@/core/contexts/FavoritesContext";
import styles from "@/pages/books/book.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

export default function book() {
  const { addToCart, formatPrice } = useCart();
  const { favorites, setFavorites } = useFavorites();
  const router = useRouter();

  const [showFull, setShowFull] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  //   Buscar el producto por su id
  const { url, id } = router.query;
  const product = products.find((p) => p.id === id);

  // Verificar si un producto específico está en la lista de favoritos cuando la lista de favoritos o el producto cambian.
  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      // Verificar si el producto ya está en los favoritos
      const isAlreadyFavorite = product
        ? favorites.some((fav) => fav.id === product.id)
        : false;
      setIsFavorite(isAlreadyFavorite);
    }
  }, [favorites, product]);

  // Número de caracteres visibles antes de "Ver más"
  const MAX_LENGTH = 300;

  // Si no se encuentra el producto
  if (!product) {
    return <p>Producto no encontrado</p>;
  }

  // Para volver a la página anterior
  const goBack = () => {
    router.back();
  };

  // Funcion para agregar a favoritos
  const handleAddToFavorites = () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      alert("Por favor, inicia sesión para agregar a favoritos");
      return;
    }
    
    if (isFavorite) {
      // Eliminar del arreglo de favoritos
      const updatedFavorites = favorites.filter((fav) => fav.id !== product.id);
      setFavorites(updatedFavorites);
    } else {
      // Agregar al arreglo de favoritos
      setFavorites([...favorites, product]);
    }
    setIsFavorite(!isFavorite); // Cambiar el estado del favorito
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
        <a className="back" onClick={goBack}>
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
            {product.isPresale == false && product.isNew == false ? (
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
            <p className={`link ${styles.like}`} onClick={handleAddToFavorites}>
              <FontAwesomeIcon icon={isFavorite ? faHeartSolid : faHeart} />
              {isFavorite ? " Añadido a favoritos" : " Añadir a favoritos"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
