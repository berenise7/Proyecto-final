import { useSearch } from "@/core/contexts/SearchContext";
import { useCart } from "@/core/contexts/CartContext";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./SearchResults.module.css";

export default function SearchResults() {
  // Uso de search context
  const { results, clearSearch } = useSearch();
  // Uso de cart context
  const { formatPrice } = useCart();

  // useState
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // useRef
  const searchRef = useRef(null);

  // Funcion para alternar el estado de la barra de búsqueda
  const toggleSearch = (e) => {
    e.stopPropagation();
    setIsSearchOpen((prevState) => {
      !prevState;
      clearSearch();
    });
  };

  // useEffect
  // Cierra el cuadro de búsqueda al clicar fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLinkClick = () => {
    clearSearch(); // Limpiar la búsqueda al hacer clic en el enlace
  };

  return (
    results.length > 0 &&
    !isSearchOpen && (
      <div
        className={styles.booksContainer}
        ref={searchRef}
        onClick={toggleSearch}
      >
        <div className={styles.grid}>
          {results.map((book) => (
            <div key={book._id} className={styles.productCard}>
              <Link href={`${book.url}/${book._id}`} onClick={handleLinkClick}>
                <img src={book.image} alt={book.title} />
                <h3>{book.title}</h3>
                <p className={styles.price}>{formatPrice(book.price)}€</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    )
  );
}
