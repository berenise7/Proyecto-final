import Header from "@/components/Header/Header";
import { useFavorites } from "@/core/contexts/FavoritesContext";
import { useCart } from "@/core/contexts/CartContext";
import { useRouter } from "next/router";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "./favorites.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import {
  faHeart as faHeartSolid,
  faFilePen,
} from "@fortawesome/free-solid-svg-icons";

export default function favorites() {
  const { addToCart } = useCart();

  const { favorites, toggleFavorite } = useFavorites();
  const [isAuth, setIsAuth] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      router.push("/user/login"); // Redirige al login si no está autenticado
    } else {
      setIsAuth(true);
    }
  }, [router]);

  if (!isAuth) {
    return <p>Cargando...</p>; // Muestra un mensaje mientras se verifica el login
  }

  // Para remplazar los espacios por -
  const formatTitleForURL = (title) => {
    return title.toLowerCase().split(" ").join("-");
  };
  return (
    <>
      <Header />
      <div className={styles.container}>
        <h2>Mis favoritos</h2>
        {favorites.length === 0 ? (
          <p>No tienes favoritos aún.</p>
        ) : (
          <div className={styles.favoritesGrid}>
            {favorites.map((book) => (
              <div className={styles.card} key={book.id}>
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
                <Link href={`${book.url}/${book.id}`} className={styles.link}>
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
                        favorites.some((fav) => fav.id === book.id)
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
      </div>
    </>
  );
}
