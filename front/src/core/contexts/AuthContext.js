import { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { handleLoginFetch } from "@/api/usersFetch";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState(null);
    const router = useRouter();

    // Verificar si hay sesión al cargar la página
    useEffect(() => {
        const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken)
            setUser(JSON.parse(localStorage.getItem("user")) || null);
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
            if (values.rememberMe) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.data));
            } else {
                sessionStorage.setItem("token", data.token);
                sessionStorage.setItem("user", JSON.stringify(data.data));
            }
            router.push('/')
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


    // Función para actualizar los datos del usuario
    const updateUser = (updatedData) => {
        setUser(updatedData);
        localStorage.setItem("user", JSON.stringify(updatedData)); // Guardar los cambios en localStorage
        router.back();
    };

    return (
        <AuthContext.Provider value={{ user, loginError, showPassword, setShowPassword, handleLogin, updateUser, handleLogout}}>
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