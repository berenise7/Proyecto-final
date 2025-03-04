
export const handleLoginFetch = async (email, password) => {
    try {
        const response = await fetch(`http://localhost:9000/users/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        })

        const data = await response.json();
        return data;
    } catch (error) {
        return { status: "Error", message: "Error en el servidor. Inténtalo de nuevo." };
    }
}