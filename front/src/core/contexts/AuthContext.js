import { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { handleLoginFetch, registerUser, updateProfile } from "@/api/usersFetch";
import { useFavorites } from "./FavoritesContext";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    const { setFavorites } = useFavorites()
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loginError, setLoginError] = useState(null);
    const router = useRouter();

    // Verificar si hay sesión al cargar la página
    useEffect(() => {
        const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken)
            setUser(JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user")) || null);
        }

    }, []);


    // Funcion para iniciar sesion
    const handleLogin = async (values, { setSubmitting }) => {
        setSubmitting(true);
        setLoginError(null)

        const data = await handleLoginFetch(values.email, values.password)
        if (data.status === "Succeeded") {
            setUser(data.data);
            setToken(data.token)
            setFavorites(data.data.favorites)

            if (values.rememberMe) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.data));
            } else {
                sessionStorage.setItem("token", data.token);
                sessionStorage.setItem("user", JSON.stringify(data.data));
            }
            router.push('/').then(() => {
                // Esto es para asegurarte de que los datos estén disponibles después de la redirección
                const userFromStorage = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user"));
                const tokenFromStorage = localStorage.getItem("token") || sessionStorage.getItem("token");
                console.log(userFromStorage, tokenFromStorage);  // Verifica si los datos están disponibles
            });
        } else {
            setLoginError(data.message)
        }
        setSubmitting(false);
    };


    const handleLogout = () => {
        setUser(null);
        setToken(null)
        localStorage.removeItem(`cart_${localStorage.getItem("token")}`);
        localStorage.removeItem(`favorites_${localStorage.getItem("token")}`);
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        sessionStorage.removeItem(`cart_${sessionStorage.getItem("token")}`);
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