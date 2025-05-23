import { searchBooks } from "@/api/booksFetch";
import styles from "./Header.module.css";

import React, { useState, useEffect } from "react";
import { useSearch } from "@/core/contexts/SearchContext";

export default function Search() {
  // Uso de search context
  const { setResults } = useSearch();

  // useState
  const [query, setQuery] = useState("");

  // useEffect
  useEffect(() => {
    if (query.length < 3) {
      setResults([]); // Limpia los resultados si la query es muy corta
      return;
    }
    // Funcion para quitar los acentos y convertirlo en minúsculas
    const removeAccents = (str) => {
      return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    };
    // Funcion para hacer la busqueda con un tiempo: 500ms
    const timer = setTimeout(async () => {
      const normalizedQuery = removeAccents(query);
      const books = await searchBooks(normalizedQuery);
      setResults(books);
    }, 500); // Espera 500ms antes de hacer la petición

    return () => clearTimeout(timer); // Limpia el temporizador si el usuario sigue escribiendo
  }, [query, setResults]);

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        placeholder="Busca por autor, título o ISBN"
        className={styles.searchBar}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}
