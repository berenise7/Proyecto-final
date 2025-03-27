// Fetch para añadir un libro al carrito
export const addBookToCart = async (userId, bookId, quantity) => {
    try {
        const response = await fetch(`http://localhost:9000/cart/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, bookId, quantity }),
        })

        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            console.error("Error al agregar al carrito:", data.message);
        }
    } catch (error) {
        return { error: "Ocurrió un error inesperado" };
    }
}

// Fetch para ver el carro
export const getCart = async (userId) => {
    try {
        const response = await fetch(`http://localhost:9000/cart/${userId}`)

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en la solicitud:", error);
        return { error: "Ocurrió un error inesperado" };
    }
}

// Fetch borrar libro del carrito
export const removeBookFromCart = async (userId, bookId) => {
    try {
        const response = await fetch(`http://localhost:9000/cart/remove`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, bookId }),
        })

        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            console.error("Error al eliminar el libro del carrito:", data.message);
        }
    } catch (error) {
        return { error: "Ocurrió un error inesperado" };
    }
}

// Actualizar el carro
export const updateCartItem = async (userId, bookId, quantity) => {
    try {
        const response = await fetch(`http://localhost:9000/cart/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, bookId, quantity }),
        })

        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            console.error("Error al actualizar el carrito:", data.message);
        }
    } catch (error) {
        return { error: "Ocurrió un error inesperado" };
    }
}

// Fetch para juntar el carrito local con el carrito de la base de datos
export const mergeCart = async (userId, localCart) => {
    try {
        const response = await fetch(`http://localhost:9000/cart/merge`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, localCart }),
        })

        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            console.error("Error al mergear el carrito:", data.message);
        }
    } catch (error) {
        return { error: "Ocurrió un error inesperado" };
    }
}
