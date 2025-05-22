import { createContext, useState, useContext, useRef, useEffect } from "react";

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    // useState
    const [results, setResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    // Funcion para resetear la búsqueda
    const clearSearch = () => {
        setSearchQuery("");
        setResults([])
    };

    return (
        <SearchContext.Provider value={{ results, setResults, searchQuery, setSearchQuery, clearSearch }}>
            {children}
        </SearchContext.Provider>
    )
};

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error("useSearch debe usarse dentro de un SearchProvider");
    }
    return context;
};