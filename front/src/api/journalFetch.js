// Petición para ver un journal
export const getJournal = async (userId, bookId) => {
    try {
        const response = await fetch(`http://localhost:9000/journal/getJournal?userId=${userId}&bookId=${bookId}`)
        if (!response.ok) {
            console.log(response);

            const errorData = await response.json()
            return { error: errorData.error || `Error en la petición: ${response.status} ${response.statusText}` };
        }
        const journal = await response.json()
        return journal;

    } catch (error) {
        console.error("Error al crear el reading journal:", error);
        return { error: "Ocurrió un error inesperado" };
    }
}

// Petición para ver todos los journals de un user
export const getAllJournals = async (userId, page = 1) => {
    try {
        const response = await fetch(`http://localhost:9000/journal/getAllJournals?userId=${userId}&page=${page}`)

        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            console.error("mensaje de error:", data.error);
        }
    } catch (error) {
        return { error: "Ocurrió un error inesperado" };
    }
}

// Petición para crear un journal
export const createJournal = async (bodyParam) => {
    try {
        const response = await fetch('http://localhost:9000/journal/create', {
            method: 'POST',
            body: bodyParam,
        });
        if (!response.ok) {
            console.log(response);

            const errorData = await response.json()
            return { error: errorData.error || `Error en la petición: ${response.status} ${response.statusText}` };
        }
        const bookCreated = await response.json()
        return bookCreated;

    } catch (error) {
        console.error("Error al crear el reading journal:", error);
        return { error: "Ocurrió un error inesperado" };
    }
}

// Petición para eliminar un journal
export const deleteJournal = async (_id) => {
    try {
        const response = await fetch(`http://localhost:9000/journal/${_id}`, {
            method: "DELETE",
        })

        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            console.error("mensaje de error:", data.error);
        }
    } catch (error) {
        return { error: "Ocurrió un error inesperado" };
    }
}

// Petición para editar un journal
export const updateJournal = async (_id, bodyParam) => {
    try {
        const response = await fetch(`http://localhost:9000/journal/${_id}`, {
            method: "PUT",
            body: bodyParam,
        })

        const data = await response.json();
        console.log(data);
        if (response.ok) {
            return data;
        } else {
            console.error("mensaje de error:", data.error);
        }
    } catch (error) {
        return { error: "Ocurrió un error inesperado" };
    }
}