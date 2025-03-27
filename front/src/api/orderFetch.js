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