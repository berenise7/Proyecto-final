import React, { useState, useEffect } from "react";
import styles from "@/components/Home/CardsMenu.module.css";
import { getBooksFilter } from "@/api/booksFetch";
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
  // uso de cart context
  const { addToCart, formatPrice } = useCart();
  // uso de favorites context
  const { favorites, toggleFavorite } = useFavorites();

  // usestate
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [books, setBooks] = useState([]);

  // useEffect
  // Obtiene los libros recomendados
  useEffect(() => {
    const fetchBooks = async () => {
      const filters = {
        isRecommendation: true,
      };
      const booksData = await getBooksFilter(filters);
      console.log("isRecommendation", booksData);
      if (booksData) {
        // Actualiza el estado con los libros obtenidos
        setBooks(booksData.data);
      } else {
        console.error("La respuesta no es un array", booksData);
      }
    };
    fetchBooks();
  }, []);

  // Verificar si existe el token
  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
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

  // Calcula número total del páginas
  const totalPages = Math.ceil(books.length / itemsPerPage);
  // Muestra los productos correspondientes en la pagina actual
  const displayedProducts = books.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <>
      <div className={styles.container}>
        <h2>Recomendaciones</h2>
        <div className={styles.productList}>
          {displayedProducts.map((book, index) => (
            <div className={styles.productCard} key={index}>
              <Link href={`${book.url}/${book._id}`}>
                <img src={book.image} alt={book.title} />
                <div className={styles.productInfo}>
                  {book.quantity >= 1 ? (
                    (book.isNewBook && (
                      <span className={styles.badge}>Nuevo</span>
                    )) ||
                    (book.isPresale && (
                      <span className={styles.badge}>Preventa</span>
                    ))
                  ) : (
                    <span className={styles.badge}>Sin stock</span>
                  )}
                  <h3 className={styles.title}>{book.title}</h3>
                  <p className={styles.author}>{book.author}</p>
                  <p>
                    <span className={styles.price}>
                      {formatPrice(book.price)}€
                    </span>
                  </p>
                  <p>{book.cover}</p>
                  {/* <Link href={book.url}>Ver más</Link> */}
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
                        favorites?.some((fav) => fav.book_id === book._id)
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
