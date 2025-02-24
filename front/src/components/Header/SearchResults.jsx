import { useSearch } from "@/core/contexts/SearchContext";
import { useCart } from "@/core/contexts/CartContext";

import React from "react";
import Link from "next/link";
import styles from "./SearchResults.module.css";

export default function SearchResults() {
  const { results, clearSearch } = useSearch();
  const { formatPrice } = useCart();

  const handleLinkClick = () => {
    clearSearch(); // Limpiar la búsqueda al hacer clic en el enlace
  };

  return (
    results.length > 0 && (
      <div className={styles.booksContainer}>
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
