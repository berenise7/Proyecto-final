import { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import users from "@/api/users";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {

    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState("");

    // Funcion para iniciar sesion
    const handleLogin = (values) => {
        const user = users.find((u) => u.email === values.email && u.password === values.password)
        if (user) {
            const fakeToken = "1234567890abcdef"; //  Token simulado
            if (values.rememberMe) {
                localStorage.setItem("token", fakeToken); // Guardar en localStorage (sesión persistente)
            } else {
                sessionStorage.setItem("token", fakeToken); // Guardar en sessionStorage (se borra al cerrar navegador)
            }
            router.push("/");
        } else {
            setLoginError("Correo o contraseña incorrectos");
        }
    };


    return (
        <AuthContext.Provider value={{ loginError, showPassword, setShowPassword, handleLogin }}>
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