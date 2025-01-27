import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import styles from "./Header.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBasketShopping } from "@fortawesome/free-solid-svg-icons";
import Cart from "../Cart/Cart";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); //Para saber si el menu esta abierto o cerrado
  const [isCartOpen, setIsCartOpen] = useState(false); //Para saber si el carrito esta abierto o cerrado
  const [isAccountOpen, setIsAccountOpen] = useState(false); //Para saber si el carrito esta abierto o cerrado

  const menuRef = useRef(null);
  const accountRef = useRef(null);
  const cartRef = useRef(null);

  // Funcion para alternar el estado del menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  // Funcion para alternar el estado del carrito
  const onCartToggle = () => {
    setIsCartOpen(!isCartOpen);
  };
  const toggleAccount = () => {
    setIsAccountOpen(!isAccountOpen);
  };

  // Cierra el menú si se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setIsAccountOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef,accountRef, cartRef]);

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
          <div className={styles.overlayMenu} ref={menuRef}>
            <ul>
              <li
                onClick={toggleAccount}
                className={isAccountOpen ? styles.accountActive : ""}
              >
                Mi cuenta
                {isAccountOpen && (
                  <div className={styles.accountSubmenu} ref={accountRef}>
                    <li>Mis datos</li>
                    <li>Mi biblioteca</li>
                  </div>
                )}
              </li>
              <li>Todos los libros</li>
              <li>Ficción</li>
              <li>No Ficción</li>
              <li>Juvenil</li>
              <li>Fantasía</li>
              <li>Thriller</li>
              <li>Romance</li>
            </ul>
          </div>
        )}
        {isCartOpen && <Cart cartRef={cartRef} />}
      </header>
    </>
  );
}
