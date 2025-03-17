import { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { addBookToCart, getCart } from "@/api/cartFetch";
import { updateBook } from "@/api/booksFetch";

const CartContext = createContext()

export default CartContext

// Proveedor del contexto
export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [subtotal, setSubtotal] = useState("")
    const router = useRouter();

    // Cargar el carrito desde localStorage al inicio o de user
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));
        if (user) {
            const fetchCart = async () => {
                const cartData = await getCart(user._id)
                setCart(cartData.data.books)
                setSubtotal(cartData.data.subtotal)
            }
            fetchCart()
        }


    }, [cart]);

    // Guardar el carrito en localStorage cada vez que cambie
    useEffect(() => {

        if (cart.length > 0) {
            localStorage.setItem(`cart`, JSON.stringify(cart));  // Guardar el carrito cada vez que cambia
        }

    }, [cart]);

    // Función para agregar un libro al carrito
    const addToCart = async (book) => {
        const user = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));
        if (user) {
            const userId = user?._id
            const result = await addBookToCart(userId, book._id, 1);
            console.log(result);

            if (result.status === "Succeeded") {

                const updatedCart = await getCart(userId)

                setCart(updatedCart.data.books || []); // Actualizar carrito con el del backend
                console.log("se guarda libro", cart);

            } else {
                // console.error("Error al agregar al carrito:", error);
                console.log("Error al guardar el libro:", result?.error);
            }
        } else {
            setCart((prevCart) => {
                // Verificar si el producto ya está en el carrito
                if (prevCart.some((item) => item._id === book._id)) {
                    return prevCart.map((item) =>
                        item._id === book._id ? { ...item, quantity: item.quantity + 1 } : item
                    );
                }
                return [...prevCart, { ...book, quantity: 1 }];
            });

        }

    };

    // Función para incrementar la cantidad del producto
    const incrementQuantity = (_id) => {
        setCart((prevItems) =>
            prevItems.map((item) =>
                item._id === _id && item.quantity > 0
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    // Función para disminuir la cantidad de un producto
    const decrementQuantity = (id) => {
        setCart((prevItems) =>
            prevItems.map((item) =>
                item._id === id && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    };
    // Función para eliminar un libro del carrito
    const removeFromCart = (id) => {
        setCart((prevItems) => prevItems.filter((item) => item._id !== id));
    };

    // Calcular todo el total
    const calculateTotal = () => {
        if (!user) {

            return cart
                .reduce((acc, item) => acc + item.price * item.quantity, 0)
                .toFixed(2);
        }
    };


    // Total de productos añadidos

    const totalQuantity = cart?.reduce((total, item) => total + item.quantity, 0) || cart?.reduce((total, item) => total + item.book_id.quantity, 0);




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


    return (
        <CartContext.Provider value={{ cart, subtotal, addToCart, removeFromCart, incrementQuantity, decrementQuantity, calculateTotal, totalQuantity, formatPrice, }}>
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