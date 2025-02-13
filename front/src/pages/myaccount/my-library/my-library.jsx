import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Header from "@/components/Header/Header";
import products from "@/api/productos";
import reading from "@/api/reading";
import styles from "./mylibrary.module.css";

export default function MyLibrary() {
  const router = useRouter();
    const [isAuth, setIsAuth] = useState(false);
  

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

  const formatTitleForURL = (title) => {
    return title.toLowerCase().split(" ").join("-");
  };

  const goBack = () => {
    router.back();
  };
  return (
    <>
      <Header />
      <div className={styles.container}>
        <a className="back" onClick={goBack}>
          <FontAwesomeIcon icon={faChevronLeft} /> Volver atras
        </a>
        <h2>Mis Lecturas terminadas</h2>
        {reading.length === 0 ? (
          <p>No tienes ningun libro terminado</p>
        ) : (
          <div className={styles.readingGrid}>
            {reading.map((read) => {
              const book = products.find((p) => p.id === read.book_id);
              if (!book) return null;
              return (
                <div className={styles.card} key={read.id}>
                  <Link
                    className={styles.link}
                    href={`/reading-journal/${formatTitleForURL}(book.title)}/${book.id}`}
                  >
                    <img src={book.image} alt={book.title} />
                    <h3>{book.title}</h3>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
