import { createContext, useContext, useState, useEffect } from "react";

const FavoritesContext = createContext();

export default FavoritesContext;

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);

    // Cargar los favoritos desde localStorage cuando el usuario inicia sesión
    useEffect(() => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (token) {
            const savedFavorites = localStorage.getItem(`favorites_${token}`);
            if (savedFavorites) {
                setFavorites(JSON.parse(savedFavorites));  // Cargar los favoritos guardados
            }
        }
    }, []);

    // Guardar los favoritos en localStorage cada vez que cambien
    useEffect(() => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (token && favorites.length > 0) {
            localStorage.setItem(`favorites_${token}`, JSON.stringify(favorites));  // Guardar los favoritos cada vez que cambian
        }
    }, [favorites]);

    // Función para alternar favoritos
    const toggleFavorite = (book) => {
        setFavorites((prevFavorites) => {
            const isFavorite = prevFavorites.some((fav) => fav.id === book.id);
            if (isFavorite) {
                return prevFavorites.filter((fav) => fav.id !== book.id); // Quitar de favoritos
            } else {
                return [...prevFavorites, book]; // Agregar a favoritos
            }
        });
    };
    return (
        <FavoritesContext.Provider value={{ favorites, setFavorites, toggleFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error("useFavorites debe usarse dentro de un FavoritesProvider");
    }
    return context;
};