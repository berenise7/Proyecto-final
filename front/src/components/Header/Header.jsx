import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import styles from "./Header.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBasketShopping } from "@fortawesome/free-solid-svg-icons";
import DropDownCart from "../cart/DropDownCart";
import { useCart } from "@/core/contexts/CartContext";
import { useRouter } from "next/router";
import { useAuth } from "@/core/contexts/AuthContext";

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false); //Para saber si el menu esta abierto o cerrado
  const [isCartOpen, setIsCartOpen] = useState(false); //Para saber si el carrito esta abierto o cerrado
  const [isAccountOpen, setIsAccountOpen] = useState(false); //Para saber si el carrito esta abierto o cerrado
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Uso el context del carrito
  const { cart, totalQuantity, handleLogout } = useCart();
  // Uso el context de auth
  const { user } = useAuth;
  
  const buttonMenuRef = useRef(null);
  const buttonAccountRef = useRef(null);
  const buttonCartRef = useRef(null);
  const menuRef = useRef(null);
  const accountRef = useRef(null);
  const cartRef = useRef(null);

  // Funcion para alternar el estado del menu
  const toggleMenu = (event) => {
    event.stopPropagation();
    setIsMenuOpen((prevState) => !prevState);
  };
  const toggleAccount = () => {
    setIsAccountOpen((prevState) => !prevState);
  };
  // Funcion para alternar el estado del carrito
  const onCartToggle = () => {
    setIsCartOpen((prevState) => !prevState);
  };

  // Cierra el menú, mi cuenta o el carrito si se hace clic fuera de él o se vuelve a clicar en el boton
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonMenuRef.current &&
        !buttonMenuRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target) &&
        buttonAccountRef.current &&
        !buttonAccountRef.current.contains(event.target)
      ) {
        setIsAccountOpen(false);
      }
      if (
        cartRef.current &&
        !cartRef.current.contains(event.target) &&
        buttonCartRef.current &&
        !buttonCartRef.current.contains(event.target)
      ) {
        setIsCartOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Verificar si existe el token
  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    console.log("🔎 Token encontrado:", token);
    setIsAuthenticated(!!token);
  }, []);

  // Mostrar mensaje de carga hasta que se haya verificado el estado de autenticación
  if (isAuthenticated === null) {
    return <p>Cargando...</p>;
  }

  return (
    <>
      {/* Contenedor para la barra de navegación  */}
      <header className={styles.navbar}>
        <nav>
          {/* Icono de menú, que activa o desactiva el estado isMenuOpen */}
          <div className={styles.topRow}>
            <div
              className={styles.menuIcon}
              onClick={toggleMenu}
              ref={buttonMenuRef}
            >
              <FontAwesomeIcon icon={faBars} />
            </div>
            <div className={styles.logoContainer}>
              {/* Logo de la página que funciona como enlace a la página principal */}

              <img
                src="/assets/images/logo/logo192.png"
                alt="logo"
                className={styles.iconLogo}
              />

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
            {isAuthenticated ? (
              <div className={styles.navLinks}>
                <Link href="/user/account">Mi cuenta</Link>
                <p>/</p>
                <a onClick={handleLogout}>Cerrar sesión</a>
              </div>
            ) : (
              <div className={styles.navLinks}>
                <Link href="/user/register">Registrarse</Link>
                <p>/</p>
                <Link href="/user/login">Iniciar Sesión</Link>
              </div>
            )}
            {/* Ícono del carrito, que activa o desactiva el estado isCartOpen */}
            <div
              className={styles.cartIcon}
              onClick={onCartToggle}
              ref={buttonCartRef}
            >
              <FontAwesomeIcon icon={faBasketShopping} />
              {cart.length === 0 ? "" : <span>{totalQuantity}</span>}
              {/* Muestra la cantidad de productos en el carrito */}
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
                ref={buttonAccountRef}
              >
                Mi cuenta
                {isAccountOpen && (
                  <div
                    className={styles.accountSubmenu}
                    ref={accountRef}
                    onClick={(event) => event.stopPropagation()}
                  >
                    {!isAuthenticated ? (
                      <div>
                        <li>
                          <Link href="/user/register">Registrarse</Link>
                        </li>{" "}
                        <li>
                          <Link href="/user/login">Iniciar sesión</Link>
                        </li>
                      </div>
                    ) : (
                      <div>
                        <li>
                          <Link href="/myaccount/my-data/my-data">
                            Mis datos
                          </Link>
                        </li>
                        <li>
                          <Link href="/myaccount/my-library/my-library">
                            Mis lecturas terminadas
                          </Link>
                        </li>
                        <li>
                          <Link href="/myaccount/favorites/favorites">
                            Mis favoritos
                          </Link>
                        </li>
                      </div>
                    )}
                  </div>
                )}
              </li>
              <li>
                <Link href="/books/all-books">Todos los libros</Link>
              </li>
              <li>Ficción</li>
              <li>No Ficción</li>
              <li>Juvenil</li>
              <li>Fantasía</li>
              <li>Thriller</li>
              <li>Romance</li>
            </ul>
          </div>
        )}
        {isCartOpen && <DropDownCart cartRef={cartRef} />}
      </header>
    </>
  );
}
