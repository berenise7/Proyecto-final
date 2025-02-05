import { createContext, useState, useContext} from "react";
import { useRouter } from "next/router";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {

    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState("");

    const testUser = {
        email: "test@correo.com",
        password: "Prueba123!",
    };
    const handleLogin = (values) => {
        console.log("Valores ingresados:", values);
        if (
            values.email === testUser.email &&
            values.password === testUser.password
        ) {
            const fakeToken = "1234567890abcdef"; //  Token simulado
            if (values.rememberMe) {
                console.log("✅ Guardando token en localStorage");
                localStorage.setItem("token", fakeToken); // Guardar en localStorage (sesión persistente)
            } else {
                console.log("✅ Guardando token en sessionStorage");
                sessionStorage.setItem("token", fakeToken); // Guardar en sessionStorage (se borra al cerrar navegador)
            }
            console.log("🔄 Redirigiendo a /home...");
            router.push("/");
        } else {
            console.log("❌ Error: Credenciales incorrectas");
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