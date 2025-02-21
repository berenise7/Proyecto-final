import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "@/components/Header/Header";
import StarRating from "@/components/StarRating/StarRating";
import { useCart } from "@/core/contexts/CartContext";
import { useFavorites } from "@/core/contexts/FavoritesContext";
import styles from "@/pages/books/book.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { getBook } from "@/api/booksFetch";

export default function book() {
  const { addToCart, formatPrice } = useCart();
  const { favorites, setFavorites } = useFavorites();
  const router = useRouter();
  const { _id } = router.query;

  const [showFull, setShowFull] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [book, setBook] = useState(null);

  useEffect(() => {
    const loadBook = async () => {
      const bookAux = await getBook(_id);
      setBook(bookAux.data);
    };
    loadBook();
  }, [_id]);

  // Verificar si un producto específico está en la lista de favoritos cuando la lista de favoritos o el producto cambian.
  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      // Verificar si el producto ya está en los favoritos
      const isAlreadyFavorite = book
        ? favorites.some((fav) => fav.id === book.id)
        : false;
      setIsFavorite(isAlreadyFavorite);
    }
  }, [favorites, book]);

  // Número de caracteres visibles antes de "Ver más"
  const MAX_LENGTH = 300;

  // Si no se encuentra el producto
  if (!book) {
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
      const updatedFavorites = favorites.filter((fav) => fav.id !== book.id);
      setFavorites(updatedFavorites);
    } else {
      // Agregar al arreglo de favoritos
      setFavorites([...favorites, book]);
    }
    setIsFavorite(!isFavorite); // Cambiar el estado del favorito
  };

  // Para calcular la valoracion total
  const calculateAverageRating = (ratings) => {
    if (ratings.length === 0) return "Sin valoraciones";
    const sum = ratings.reduce((acc, rating) => acc + rating, 0);
    console.log(sum);

    return (sum / ratings.length).toFixed(1);
  };
  const averageRating = calculateAverageRating(book.ratings);

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <a className="back" onClick={goBack}>
          <FontAwesomeIcon icon={faChevronLeft} /> Volver atras
        </a>
        {/* Imagen del libro */}
        <div className={styles.imageContainer}>
          <img className={styles.image} src={book.image} alt={book.title} />
        </div>
        {/* Detalles del libro */}
        <div className={styles.details}>
          <div className={styles.details1}>
            <h1 className={styles.title}>{book.title}</h1>
            <p className={styles.author}>{book.author}</p>
            <p className={styles.isbn}>
              {book.editorial} - {book.isbn}
            </p>
            {/* ⭐ Sección de Valoraciones */}
            {/* Si son preventa o nuevos no se muestra las valoraciones */}
            {book.isPresale == false &&
              book.isNewBook == false &&
              book.ratings.length > 0 && (
                <div className={styles.ratings}>
                  <StarRating rating={averageRating} />
                  <span className={styles.ratingText}>
                    ({book.ratings.length} valoraciones)
                  </span>
                </div>
              )}
            {/* 📖 Descripción */}
            <div>
              <p className={styles.description}>
                <span className="bold">
                  Sipnosis de {book.title} <br />
                </span>
                {showFull
                  ? book.description
                  : `${book.description.slice(0, MAX_LENGTH)}...`}
              </p>
              <p className="link" onClick={() => setShowFull(!showFull)}>
                {showFull ? "Ver menos" : "Ver más"}
              </p>
            </div>
          </div>
          <div className={styles.details2}>
            <p className={styles.price}>{formatPrice(book.price)}€</p>
            {book.quantity >= 1 ? (
              <button className={styles.button} onClick={() => addToCart(book)}>
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
