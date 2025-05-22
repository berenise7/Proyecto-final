import { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { handleLoginFetch } from "@/api/usersFetch";
import { useFavorites } from "./FavoritesContext";

import { mergeCart, getCart } from "@/api/cartFetch";
import { useCart } from "./CartContext";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    // Uso de favorites context
    const { setFavorites } = useFavorites();
    // Uso de cart context
    const { setCart} = useCart()

    // useState
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loginError, setLoginError] = useState(null);

    // useRouter
    const router = useRouter();

    // useEffect
    // Verificar si hay sesión al cargar la página
    useEffect(() => {
        const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken)
            setUser(JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user")) || null);
        }

    }, []);

    // Funcion  para juntar el carro de localStorage con el de la base de datos
    const mergeCartFuntion = async (user) => {
        const userId = user._id;
        const getCartFromStorage = (storage, key) => {
            const data = storage.getItem(key);
            return data ? JSON.parse(data) : null;
        };

        const cart = getCartFromStorage(localStorage, "cart") || getCartFromStorage(sessionStorage, "cart") || null;

        if (cart) {

            const merge = await mergeCart(userId, cart)
            if (merge?.status === "Succeeded") {

                const updatedCart = await getCart(userId)

                setCart(updatedCart.data.books || []);
            } else {
                console.log("Error al guardar el libro:", merge?.error);
            }
        }
    }

    // Funcion para iniciar sesion
    const handleLogin = async (values, { setSubmitting }) => {
        setSubmitting(true);
        setLoginError(null)

        const data = await handleLoginFetch(values.email, values.password)
        if (data.status === "Succeeded") {
            setUser(data.data);

            setFavorites(data.data.favorites)
            mergeCartFuntion(data?.data);
            const updatedCart = await getCart(data?.data._id)

            setCart(updatedCart.data?.books || []);

            if (values.rememberMe) {
                setToken(data.token_refresh)
                localStorage.setItem("token", data.token_refresh);
                localStorage.setItem("user", JSON.stringify(data.data));
            } else {
                setToken(data.token)
                sessionStorage.setItem("token", data.token);
                sessionStorage.setItem("user", JSON.stringify(data.data));
            }
            router.push('/').then(() => {
                // Esto es para asegurarte de que los datos estén disponibles después de la redirección
                const userFromStorage = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user"));
                const tokenFromStorage = localStorage.getItem("token") || sessionStorage.getItem("token");
            });
        } else {
            setLoginError(data.message)
        }
        setSubmitting(false);
    };

    // Funcion para cerrar sesion
    const handleLogout = () => {
        setUser(null);
        setToken(null)
        localStorage.removeItem(`cart`);
        localStorage.removeItem(`favorites_${localStorage.getItem("token")}`);
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        sessionStorage.removeItem(`cart`);
        sessionStorage.removeItem(`favorites_${sessionStorage.getItem("token")}`);
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
        router.reload();
    }




    return (
        <AuthContext.Provider value={{ user, setUser, token, setToken, loginError, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }
    return context;
};