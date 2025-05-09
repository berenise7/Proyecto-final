import React from "react";
import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.logoSection}>
            <img
              src="/assets/images/logo/logo192.png"
              alt="Literary Haven logo"
            />
            <h2>Literary Haven</h2>
          </div>
          <div className={styles.linksSection}>
            <div>
              <h4>Explora</h4>
              <Link href="/books/all-books">Todos los libros</Link>
              <Link href="/books/fantasy-books">Fantasía</Link>
              <Link href="/books/romance-books">Romance</Link>
              <Link href="/books/drama-books">Drama</Link>
              <Link href="/books/thriller-books">Thriller</Link>
              <Link href="/books/terror-books">Terror</Link>
            </div>
            <div>
              <h4>Mi cuenta</h4>
              <Link href="/myaccount/my-data/my-data">Mis datos</Link>
              <Link href="/myaccount/my-library/my-library">
                Mis lecturas terminadas
              </Link>
              <Link href="/myaccount/favorites/favorites">Mis favoritos</Link>
              <Link href="/myaccount/my-orders/orders">Mis pedidos</Link>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>
            &copy; {new Date().getFullYear()} Literary Haven. Todos los derechos
            reservados.
          </p>
        </div>
      </footer>
    </>
  );
}
