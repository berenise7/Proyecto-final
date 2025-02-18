import Header from "@/components/Header/Header";
import React, { useState, useEffect } from "react";
import Link from "next/link";

import products from "@/api/productos";
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

export default function allBooks() {
  const router = useRouter();
  const { addToCart, formatPrice } = useCart();
  const { favorites, toggleFavorite } = useFavorites();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
  return (
    <>
      <Header />
      <div className={styles.booksContainer}>
        <a className="back" onClick={goBack}>
          <FontAwesomeIcon icon={faChevronLeft} /> Volver atras
        </a>
        <h2>Todos los Libros</h2>
        <div className={styles.grid}>
          {products.map((book) => (
            <div className={styles.productCard} key={book.id}>
              {isAuthenticated ? (
                <button
                  className={styles.topRightButton}
                  onClick={() =>
                    router.push(
                      `/reading-journal/${formatTitleForURL(book.title)}/${
                        book.id
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
              <Link href={`${book.url}/${book.id}`} className={styles.link}>
                <div>
                  <img src={book.image} alt={book.title} />
                  <h3>{book.title}</h3>
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
                        favorites.some((fav) => fav.id === book.id)
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
      </div>
    </>
  );
}
