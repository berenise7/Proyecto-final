
export const getOrderAndPayment = async (email, page = 1) => {
    try {
        const response = await fetch(`http://localhost:9000/order?page=${page}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        })

        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            console.error("mensaje de error:", data.message);
        }
    } catch (error) {
        return { error: "Ocurrió un error inesperado" };
    }
}


export const getOrder = async (_id) => {
    try {
        const response = await fetch(`http://localhost:9000/order/${_id}`)

        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            console.error("mensaje de error:", data.message);
        }
    } catch (error) {
        return { error: "Ocurrió un error inesperado" };
    }
}

export const newOrderAndPayment = async (cartData, orderData, paymentData, userId) => {
    try {
        const response = await fetch(`http://localhost:9000/order/newOrder`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ cartData, orderData, paymentData, userId }),
        })

        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            console.error("Error al hacer el pedido:", data.message);
        }
    } catch (error) {
        return { error: "Ocurrió un error inesperado" };
    }
}