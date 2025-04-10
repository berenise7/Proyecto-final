import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import StarRating from "@/components/StarRating/StarRating";
import { useCart } from "@/core/contexts/CartContext";
import { useFavorites } from "@/core/contexts/FavoritesContext";
import styles from "./book.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { getBook } from "@/api/booksFetch";
import HeaderAndSearch from "@/components/Header/HeaderAndSearch";

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
        ? favorites.some((fav) => fav.id === book._id)
        : false;
      setIsFavorite(isAlreadyFavorite);
    }
  }, [favorites, book]);

  // Número de caracteres visibles antes de "Ver más"
  const MAX_LENGTH = 300;

  // Para volver a la página anterior
  const goBack = () => {
    router.back();
  };

  // Si no se encuentra el producto
  if (!book) {
    return (
      <>
        <HeaderAndSearch />
        <div className={styles.orderContainer}>
          <a className="back" onClick={goBack}>
            <FontAwesomeIcon icon={faChevronLeft} /> Volver atras
          </a>
          <h2>Libro no encontrado</h2>
        </div>
      </>
    );
  }

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



  return (
    <div>
      <HeaderAndSearch />
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
