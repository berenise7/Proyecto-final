import { getAllBooks } from "@/api/booksFetch";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./books.module.css";
import { useFavorites } from "@/core/contexts/FavoritesContext";
import { useCart } from "@/core/contexts/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import {
  faHeart as faHeartSolid,
  faFilePen,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import HeaderAndSearch from "@/components/Header/HeaderAndSearch";

export default function comedyBooks() {
  const router = useRouter();
  const { addToCart, formatPrice } = useCart();
  const { favorites, toggleFavorite } = useFavorites();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [books, setBooks] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchBooks = async () => {
      const booksData = await getAllBooks(sortBy, currentPage, "Terror");
      if (booksData) {
        setBooks(booksData.data);
        setTotalPages(booksData.totalPages);
      } else {
        console.error("La respuesta no es un array", booksData);
        setError("No se pudieron cargar los libros. Intenta más tarde.");
      }
    };
    fetchBooks();
  }, [sortBy, currentPage]);


  // Verificar si existe el token
  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    console.log("🔎 Token encontrado:", token);
    setIsAuthenticated(!!token);
  }, []);

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
      <div className={styles.booksContainer}>
        <a className="back" onClick={goBack}>
          <FontAwesomeIcon icon={faChevronLeft} /> Volver atras
        </a>
        <h2>Todos los Libros de Romance</h2>
        <div className={styles.selectAndPagination}>
          <select
            onChange={handleSortChange}
            value={sortBy}
            className={styles.select}
          >
            <option value="newest">Más recientes</option>
            <option value="oldest">Más antiguos</option>
            <option value="title_asc">Título (A-Z)</option>
            <option value="title_desc">Título (Z-A)</option>
            <option value="editorial_asc">Editorial (A-Z)</option>
            <option value="editorial_desc">Editorial (Z-A)</option>
          </select>
          <div className={styles.pagination}>
            <button onClick={goToPrevPage} disabled={currentPage === 1}>
              Anterior
            </button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </button>
          </div>
        </div>
        <div className={styles.grid}>
          {Array.isArray(books) && books.length > 0 ? (
            books.map((book) => (
              <div className={styles.productCard} key={book.id}>
                {isAuthenticated ? (
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
                ) : (
                  ""
                )}
                <Link href={`${book.url}/${book._id}`} className={styles.link}>
                  <div>
                    <img src={book.image} alt={book.title} />
                    <h3>{book.title}</h3>
                    <p className={styles.editorial}>{book.editorial}</p>
                    <p className={styles.price}>{formatPrice(book.price)}€</p>
                  </div>
                </Link>
                <div className={styles.actions}>
                  {book.quantity >= 1 ? (
                    <button onClick={() => addToCart(book)}>Añadir</button>
                  ) : (
                    ""
                  )}
                  {isAuthenticated ? (
                    <button onClick={() => toggleFavorite(book)}>
                      <FontAwesomeIcon
                        icon={
                          favorites.some((fav) => fav.id === book._id)
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
            ))
          ) : (
            <p>Ups.. al parecer no se ha encontrado ningún libro</p>
          )}
        </div>
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
    </>
  );
}
