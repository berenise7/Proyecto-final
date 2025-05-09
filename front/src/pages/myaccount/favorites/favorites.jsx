import React, { useEffect, useState } from "react";
import { getFavorites } from "@/api/booksFetch";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/router";
import Link from "next/link";
import { useFavorites } from "@/core/contexts/FavoritesContext";
import { useCart } from "@/core/contexts/CartContext";
import styles from "./favorites.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import {
  faHeart as faHeartSolid,
  faFilePen,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import HeaderAndSearch from "@/components/Header/HeaderAndSearch";
import Footer from "@/components/Footer/Footer";

export default function favorites() {
  const { addToCart } = useCart();
  const { favorites, toggleFavorite } = useFavorites();

  const [isAuth, setIsAuth] = useState(false);
  const [books, setBooks] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      setIsAuth(true);
      const decoded = jwtDecode(token);
      const favorites = decoded.favorites?.map((fav) => fav.book_id) || [];

      if (favorites.length > 0) {
        getFavorites(favorites, currentPage)
          .then((data) => {
            if (data && Array.isArray(data.data)) {
              setBooks(data.data); // Solo actualiza `books` si es un arreglo
              setTotalPages(data.totalPages);
            } else {
              console.error("La respuesta de la API no es un arreglo");
            }
          })
          .catch((error) =>
            console.error("Error al obtener libros favoritos:", error)
          );
      } else {
        setIsAuth(false);
      }
    }
  }, [router, books]);

  // Para remplazar los espacios por -
  const formatTitleForURL = (title) => {
    return title.toLowerCase().split(" ").join("-");
  };

  const goBack = () => {
    router.back();
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };
  return (
    <>
      <HeaderAndSearch />
      <div className={styles.container}>
        <a className="back" onClick={goBack}>
          <FontAwesomeIcon icon={faChevronLeft} /> Volver atras
        </a>
        <h2>Mis favoritos</h2>

        <div className={styles.pagination}>
          <button onClick={goToPrevPage} disabled={currentPage === 1}>
            Anterior
          </button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <button onClick={goToNextPage} disabled={currentPage === totalPages}>
            Siguiente
          </button>
        </div>

        {books.length === 0 ? (
          <p>No tienes favoritos aún.</p>
        ) : (
          <div className={styles.favoritesGrid}>
            {books.map((book) => (
              <div className={styles.card} key={book.id}>
                <button
                  className={styles.topRightButton}
                  onClick={() =>
                    router.push(
                      `/reading-journal/${formatTitleForURL(book.title)}/${
                        book._id
                      }`
                    )
                  }
                >
                  {" "}
                  <FontAwesomeIcon icon={faFilePen} />
                </button>
                <Link href={`${book.url}/${book._id}`} className={styles.link}>
                  <div>
                    <img src={book.image} alt={book.title} />
                    <h3>{book.title}</h3>
                  </div>
                </Link>
                <div className={styles.cardButtons}>
                  {book.quantity >= 1 ? (
                    <button onClick={() => addToCart(book)}>Añadir</button>
                  ) : (
                    ""
                  )}
                  <button
                    onClick={() => toggleFavorite(book)}
                    className={styles.favoriteButton}
                  >
                    <FontAwesomeIcon
                      icon={
                        favorites?.some((fav) => fav.book_id === book._id)
                          ? faHeartSolid
                          : faHeart
                      }
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className={styles.pagination}>
          <button onClick={goToPrevPage} disabled={currentPage === 1}>
            Anterior
          </button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <button onClick={goToNextPage} disabled={currentPage === totalPages}>
            Siguiente
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
