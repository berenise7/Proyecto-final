import { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";

const CartContext = createContext()

export default CartContext

// Proveedor del contexto
export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const router = useRouter();

    // Cargar el carrito desde localStorage al inicio
    useEffect(() => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (token) {
            const savedCart = localStorage.getItem(`cart_${token}`);
            if (savedCart) {
                setCart(JSON.parse(savedCart));  // Cargar el carrito guardado
            }
           
        }
    }, []);

    // Guardar el carrito en localStorage cada vez que cambie
    useEffect(() => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (token && cart.length > 0) {
            localStorage.setItem(`cart_${token}`, JSON.stringify(cart));  // Guardar el carrito cada vez que cambia
        }
       
    }, [cart]);

    // Función para agregar un libro al carrito
    const addToCart = (product) => {
        setCart((prevCart) => {
            // Verificar si el producto ya está en el carrito
            if (prevCart.some((item) => item.id === product.id)) {
                return prevCart.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    // Función para incrementar la cantidad del producto
    const incrementQuantity = (id) => {
        setCart((prevItems) =>
            prevItems.map((item) =>
                item.id === id && item.quantity > 0
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    // Función para disminuir la cantidad de un producto
    const decrementQuantity = (id) => {
        setCart((prevItems) =>
            prevItems.map((item) =>
                item.id === id && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    };
    // Función para eliminar un libro del carrito
    const removeFromCart = (id) => {
        setCart((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    // Calcular todo el total
    const calculateTotal = () => {
        return cart
            .reduce((acc, item) => acc + item.price * item.quantity, 0)
            .toFixed(2);
    };

    // Total de productos añadidos
    const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);

    // Función para formatear el precio
    const formatPrice = (price) => {
        return new Intl.NumberFormat("es-ES", {
            style: "decimal",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
            .format(price)
            .replace(".", ",");
    };
    // Para cerrar sesion
    const handleLogout = () => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        localStorage.removeItem(`cart_${localStorage.getItem("token")}`);
        // O si usas sessionStorage:
        sessionStorage.removeItem(`cart_${sessionStorage.getItem("token")}`);
        setCart([]); // Limpiar el carrito
        router.push("/"); // Redirigir a la página de inicio
    };

    
    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, incrementQuantity, decrementQuantity, calculateTotal, totalQuantity, formatPrice, handleLogout, }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }
    return context;
};