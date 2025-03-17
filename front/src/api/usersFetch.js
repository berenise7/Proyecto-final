
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
        return { error: "Ocurrió un error inesperado" };
    }
}

export const registerUser = async (formData) => {
    try {
        const response = await fetch(`http://localhost:9000/users/register`, {
            method: "POST",
            body: formData,
        })
        if (!response.ok) {
            let errorMessage = `Error en la petición: ${response.status} ${response.statusText}`;

            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch {
                const errorText = await response.text();
                errorMessage = errorText || errorMessage;
            }

            return { error: errorMessage };
        }
        const userCreated = await response.json();
        return userCreated;
    } catch (error) {
        return { error: "Ocurrió un error inesperado" };
    }
}

export const addFavoriteBook = async (userId, bookId, token) => {
    try {
        const response = await fetch(`http://localhost:9000/users/favorites`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ userId, bookId })
        });

        const data = await response.json();
        if (response.ok) {
            console.log("Libro agregado a favoritos", data);
            return data;
        } else {
            console.error("Error al agregar a favoritos", data.message);
            return null;
        }
    } catch (error) {
        return { error: "Ocurrió un error inesperado" };
    }
}

export const removeFavoriteBook = async (userId, bookId, token) => {
    try {
        const response = await fetch(`http://localhost:9000/users/favorites`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ userId, bookId })
        });

        const data = await response.json();
        if (response.ok) {
            console.log("Libro eliminado de favoritos", data);
            return data;
        } else {
            console.error("Error al eliminar en favoritos", data.message);
            return null;
        }
    } catch (error) {
        return { error: "Ocurrió un error inesperado" };
    }
}

export const updateProfileFetch = async (formDataToSend) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
        console.error("No hay token de autenticación.");
        return { status: "Error", message: "No hay token disponible" };
    }

    try {
        console.log("Antes de llamada");

        const response = await fetch(`http://localhost:9000/users/profile`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formDataToSend
        });

        if (!response.ok) {
            let errorMessage = `Error en la petición: ${response.status} ${response.statusText}`;

            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch {
                const errorText = await response.text();
                errorMessage = errorText || errorMessage;
            }

            return { error: errorMessage };
        }

        const data = await response.json()
        if (response.ok) {
            return { status: "Succeeded", data };
        } else {
            return { status: "Error", message: data.message };
        }
    } catch (error) {
        return { status: "Error", message: error.message };
    }
}