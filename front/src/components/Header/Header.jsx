import Link from "next/link";
import React, { useState } from "react";
import styles from "./Header.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBasketShopping } from "@fortawesome/free-solid-svg-icons";
import Cart from "../Cart/Cart";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); //Para saber si el menu esta abierto o cerrado
  const [isCartOpen, setIsCartOpen] = useState(false); //Para saber si el carrito esta abierto o cerrado

  // Funcion para alternar el estado del menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  // Funcion para alternar el estado del carrito
  const onCartToggle = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <>
      {/* Contenedor para la barra de navegación  */}
      <header className={styles.navbar}>
        <nav>
          {/* Icono de menú, que activa o desactiva el estado isMenuOpen */}
          <div className={styles.topRow}>
            <div className={styles.menuIcon} onClick={toggleMenu}>
              <FontAwesomeIcon icon={faBars} />
            </div>
            <div className={styles.logoContainer}>
              {/* Logo de la página que funciona como enlace a la página principal */}
              <Link href="/" className={styles.iconLogo}>
                <img src="/assets/images/logo/logo192.png" alt="logo" />
              </Link>
              {/* Título de la página que funciona como enlace a la página principal */}
              <h1>
                <Link href="/">Literary Haven</Link>
              </h1>
            </div>
            <input
              type="text"
              placeholder="Busca por autor, título, género o ISBN"
              className={styles.searchBar}
            />
          </div>
          {/* Barra de búsqueda para buscar libros por autor, título, etc. */}
          <div className={styles.bottomRow}>
            {/* Enlaces de navegación a las páginas de registro y login */}
            <div className={styles.navLinks}>
              <Link href="/user/register">Register</Link>
              <p>/</p>
              <Link href="/user/login">Login</Link>
            </div>
            {/* Ícono del carrito, que activa o desactiva el estado isCartOpen */}
            <div className={styles.cartIcon}>
              <FontAwesomeIcon icon={faBasketShopping} onClick={onCartToggle} />
            </div>
          </div>
        </nav>
        {/* Menu superpuesto */}
        {isMenuOpen && (
          <div className={styles.overlayMenu}>
            <ul>
              <li>Todos los libros</li>
              <li>Ficción</li>
              <li>No Ficción</li>
              <li>Juvenil</li>
              <li>Fantasía</li>
              <li>Thriller</li>
              <li>Romance</li>
              <li>Mi cuenta</li>
            </ul>
          </div>
        )}
        {isCartOpen && <Cart />}
      </header>
    </>
  );
}
