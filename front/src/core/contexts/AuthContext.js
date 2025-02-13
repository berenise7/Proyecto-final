import { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import users from "@/api/users";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {

    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState("");
    const [user, setUser] = useState(null);

    // Verificar si hay sesión al cargar la página
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        
    }, []);


    // Funcion para iniciar sesion
    const handleLogin = (values) => {
        const foundUser = users.find((u) => u.email === values.email && u.password === values.password)
        if (foundUser) {
            const fakeToken = "1234567890abcdef"; //  Token simulado
            if (values.rememberMe) {
                localStorage.setItem("token", fakeToken); // Guardar en localStorage (sesión persistente)
                localStorage.setItem("user", JSON.stringify(foundUser)); // Guardar usuario en localStorage
            } else {
                sessionStorage.setItem("token", fakeToken); // Guardar en sessionStorage (se borra al cerrar navegador)
                sessionStorage.setItem("user", JSON.stringify(foundUser)); // Guardar en sessionStorage
            }

            setUser(foundUser); // Actualizar estado del usuario
            router.push("/");
        } else {
            setLoginError("Correo o contraseña incorrectos");
        }
    };

    // Función para actualizar los datos del usuario
    const updateUser = (updatedData) => {
        setUser(updatedData);
        localStorage.setItem("user", JSON.stringify(updatedData)); // Guardar los cambios en localStorage
        router.back();
    };

    return (
        <AuthContext.Provider value={{ user, loginError, showPassword, setShowPassword, handleLogin, updateUser }}>
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