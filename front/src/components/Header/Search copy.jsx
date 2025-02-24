import { getAllBooks, searchBooks } from "@/api/booksFetch";
import styles from "./Header.module.css";

import React, { useState, useEffect } from "react";
import { useSearch } from "@/core/contexts/SearchContext";

export default function Search() {
  const { setResults } = useSearch();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (query.length < 3) {
      setResults([]); // Limpia los resultados si la query es muy corta
      return;
    }
    const removeAccents = (str) => {
      return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    };

    const timer = setTimeout(async () => {
      console.log("Searching for:", query);
      const normalizedQuery = removeAccents(query);
      const books = await searchBooks(normalizedQuery);
      setResults(books);
    }, 500); // Espera 500ms antes de hacer la petición

    return () => clearTimeout(timer); // Limpia el temporizador si el usuario sigue escribiendo
  }, [query, setResults]);


  return (
    <div>
      <input
        type="text"
        placeholder="Busca por autor, título, género o ISBN"
        className={styles.searchBar}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}
