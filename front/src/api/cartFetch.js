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
            console.log("Libro agregado al carrito:", data);
            return data;
        } else {
            console.error("Error al agregar al carrito:", data.message);
        }
    } catch (error) {
        return { error: "Ocurrió un error inesperado" };
    }
}

export const getCart = async (userId) => {
    try {
        const response = await fetch(`http://localhost:9000/cart/${userId}`)

        const data = await response.json();
        return data;
    } catch (error) {
          console.error("Error en la solicitud:", error);
        return { error: "Ocurrió un error inesperado" };
}}