import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import styles from "./Header.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBasketShopping,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import DropDownCart from "../cart/DropDownCart";
import { useCart } from "@/core/contexts/CartContext";
import { useAuth } from "@/core/contexts/AuthContext";
import Search from "./Search";
import AccountDropdown from "./AccountDropdown";

export default function Header() {
  // useState
  const [isMenuOpen, setIsMenuOpen] = useState(false); //Para saber si el menu esta abierto o cerrado
  const [isCartOpen, setIsCartOpen] = useState(false); //Para saber si el carrito esta abierto o cerrado
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  // Uso de cart context
  const { cart, totalQuantity } = useCart();
  // Uso de user context
  const { user } = useAuth();

  // useRef
  const buttonMenuRef = useRef(null);
  const buttonAccountRef = useRef(null);
  const buttonAdminRef = useRef(null);
  const buttonCartRef = useRef(null);
  const buttonAccountDropdownRef = useRef(null);
  const menuRef = useRef(null);
  const accountRef = useRef(null);
  const adminRef = useRef(null);
  const cartRef = useRef(null);
  const accountDropDownRef = useRef(null);

  // Funcion para alternar el estado del menu
  const toggleMenu = (event) => {
    event.stopPropagation();
    setIsMenuOpen((prevState) => !prevState);
  };

  // Funcion para alternar el estado del la cuenta
  const toggleAccount = () => {
    setIsAccountOpen((prevState) => !prevState);
  };

  // Funcion para alternar el estado del menu de administrador
  const toggleAdmin = () => {
    setIsAdminOpen((prevState) => !prevState);
  };

  // Función para posicionar el dropdown debajo del boton "mi cuenta"
  const toggleAccountDropdown = () => {
    if (!isAccountDropdownOpen && buttonAccountDropdownRef.current) {
      const rect = buttonAccountDropdownRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom, // Justo debajo del botón
        left: rect.left, // Alineado con "Mi cuenta"
      });
    }
    setIsAccountDropdownOpen((prevState) => !prevState);
  };

  // Funcion para alternar el estado del carrito
  const onCartToggle = () => {
    setIsCartOpen((prevState) => !prevState);
  };
  
  // useEffect
  // Cierra el menú, mi cuenta, el carrito, menu de admin y el menu de mi cuenta si se hace clic fuera de él o se vuelve a clicar en el boton
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
        adminRef.current &&
        !adminRef.current.contains(event.target) &&
        buttonAdminRef.current &&
        !buttonAdminRef.current.contains(event.target)
      ) {
        setIsAdminOpen(false);
      }
      if (
        cartRef.current &&
        !cartRef.current.contains(event.target) &&
        buttonCartRef.current &&
        !buttonCartRef.current.contains(event.target)
      ) {
        setIsCartOpen(false);
      }
      if (
        accountDropDownRef.current &&
        !accountDropDownRef.current.contains(event.target) &&
        buttonAccountDropdownRef.current &&
        !buttonAccountDropdownRef.current.contains(event.target)
      ) {
        setIsAccountDropdownOpen(false);
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
            <Search />
          </div>
          {/* Barra de búsqueda para buscar libros por autor, título, etc. */}
          <div className={styles.bottomRow}>
            {/* Enlaces de navegación a las páginas de registro y login */}
            {isAuthenticated ? (
              <div className={styles.navLinks} onClick={toggleAccountDropdown}>
                <div
                  className={styles.myaccountDropdown}
                  ref={buttonAccountDropdownRef}
                >
                  {user?.photo ? (
                    <img src={user?.photo} className={styles.userPhoto} />
                  ) : (
                    <FontAwesomeIcon icon={faUser} />
                  )}
                  <p>Mi cuenta</p>
                </div>
              </div>
            ) : (
              <div className={styles.navLinks}>
                <Link href="/user/register">Registrarse</Link>
                <p>/</p>
                <Link href="/user/login">Iniciar Sesión</Link>
              </div>
            )}

            {isAccountDropdownOpen && (
              <AccountDropdown
                accountDropDownRef={accountDropDownRef}
                buttonRef={buttonAccountDropdownRef}
                isOpen={isAccountDropdownOpen}
                dropdownPosition={dropdownPosition}
              />
            )}

            {/* Ícono del carrito, que activa o desactiva el estado isCartOpen */}
            <div
              className={styles.cartIcon}
              onClick={onCartToggle}
              ref={buttonCartRef}
            >
              <FontAwesomeIcon icon={faBasketShopping} />
              {cart?.length === 0 ? "" : <span>{totalQuantity}</span>}
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
                    className={styles.submenu}
                    ref={accountRef}
                    onClick={(event) => event.stopPropagation()}
                  >
                    {!isAuthenticated ? (
                      <div>
                        <p>
                          <Link href="/user/register">Registrarse</Link>
                        </p>{" "}
                        <p>
                          <Link href="/user/login">Iniciar sesión</Link>
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p>
                          <Link href="/myaccount/my-data/my-data">
                            Mis datos
                          </Link>
                        </p>
                        <p>
                          <Link href="/myaccount/my-library/my-library">
                            Mis lecturas terminadas
                          </Link>
                        </p>
                        <p>
                          <Link href="/myaccount/favorites/favorites">
                            Mis favoritos
                          </Link>
                        </p>
                        <p>
                          <Link href="/myaccount/my-orders/orders">
                            Mis pedidos
                          </Link>
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </li>
              {user?.rol === "admin" ? (
                <li
                  onClick={toggleAdmin}
                  className={isAdminOpen ? styles.accountActive : ""}
                  ref={buttonAdminRef}
                >
                  Admin
                  <div
                    className={styles.submenu}
                    ref={adminRef}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <p>
                      <Link href="/admin/add-book/add-book">
                        Añadir nuevo libro
                      </Link>
                    </p>
                    <p>
                      <Link href="/admin/edit-books/all-books-edits">
                        Editar libros
                      </Link>
                    </p>
                    <p>
                      <Link href="/admin/users/users">Editar usuarios</Link>
                    </p>
                  </div>
                </li>
              ) : (
                ""
              )}
              <li>
                <Link href="/books/all-books">Todos los libros</Link>
              </li>
              <li>
                <Link href="/books/fantasy-books">Fantasías</Link>
              </li>
              <li>
                <Link href="/books/romance-books">Romances</Link>
              </li>
              <li>
                <Link href="/books/drama-books">Dramas</Link>
              </li>
              <li>
                <Link href="/books/thriller-books">Thrillers</Link>
              </li>
              <li>
                <Link href="/books/terror-books">Terror</Link>
              </li>
            </ul>
          </div>
        )}
        {isCartOpen && <DropDownCart cartRef={cartRef} />}
      </header>
    </>
  );
}
