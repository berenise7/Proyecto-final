// Inicio de sesión
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

// Registro de usuarios
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
};


export const forgotPassword = async (email) => {
    try {
        const response = await fetch(`http://localhost:9000/users/forgot-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
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
export const resetPassword = async (resetToken, newPassword, confirmPassword) => {
    try {
        const response = await fetch(`http://localhost:9000/users/reset-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ resetToken, newPassword, confirmPassword }),
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


// Listado de usuarios
export const getUsers = async (page = 1) => {
    try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token")

        const response = await fetch(`http://localhost:9000/users?page=${page}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`,
            },
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
};


// Editar rol de usuario
export const updateNewRole = async (userId, newRole) => {
    try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token")

        const response = await fetch(`http://localhost:9000/users/new-role`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ userId, newRole })

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

// Eliminar usuario
export const deleteUser = async (userId) => {
    try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token")

        const response = await fetch(`http://localhost:9000/users/delete-user`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ userId }),
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

// Busqueda de usuarios
export const searchUsers = async (query) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")

    try {
        const response = await fetch(`http://localhost:9000/users/search?query=${encodeURIComponent(query)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`,
            },
        })

        const { data } = await response.json();

        if (response.ok) {
            return data;
        } else {
            console.error("mensaje de error:", data.message);
            return [];
        }
    } catch (error) {
        return { error: "Ocurrió un error inesperado" };
    }
}

// Añadir libros a favoritos
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
            return data;
        } else {
            console.error("Error al agregar a favoritos", data.message);
            return null;
        }
    } catch (error) {
        return { error: "Ocurrió un error inesperado" };
    }
}

// Eliminar libros de favoritos
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
            return data;
        } else {
            console.error("Error al eliminar en favoritos", data.message);
            return null;
        }
    } catch (error) {
        return { error: "Ocurrió un error inesperado" };
    }
}

// Editar usuario
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