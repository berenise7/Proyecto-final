import { addFavoriteBook, removeFavoriteBook } from "@/api/usersFetch";
import { createContext, useContext, useState, useEffect } from "react";

const FavoritesContext = createContext();

export default FavoritesContext;

export const FavoritesProvider = ({ children }) => {
    // useState
    const [favorites, setFavorites] = useState([]);

    // useEffect
    // Cargar los favoritos desde localStorage cuando el usuario inicia sesión
    useEffect(() => {
        const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");

        if (storedUser) {
            const parsedUser = JSON.parse(storedUser)

            setFavorites(parsedUser?.favorites)
        }
    }, []);

    // Función para alternar favoritos
    const toggleFavorite = async (book) => {
        const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
        let token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!storedUser || !token) {
            console.error("Usuario no autenticado o token no encontrado")
            return;
        }

        const user = JSON.parse(storedUser);
        const isFavorite = favorites.some(fav => fav.book_id.toString() === book._id.toString())

        try {
            let updatedFavorites;
            let result;

            if (isFavorite) {
                result = await removeFavoriteBook(user._id, book._id, token);
            } else {
                result = await addFavoriteBook(user._id, book._id, token);
            }

            if (!result || !result.data) return;

            updatedFavorites = result.data.favorites;
            setFavorites(updatedFavorites);

            const updatedUser = { ...user, favorites: updatedFavorites };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            sessionStorage.setItem("user", JSON.stringify(updatedUser));

            if (result && result.token) {
                token = result.token;
                localStorage.setItem("token", token);
                sessionStorage.setItem("token", token);
            }

        } catch (error) {
            console.error("Error en la solicitud:", error);
        }

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