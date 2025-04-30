export const getJournal = async (userId, bookId) => {
    try {
        const response = await fetch(`http://localhost:9000/journal/getJournal?userId=${userId}&bookId=${bookId}`)
        if (!response.ok) {
            console.log(response);

            const errorData = await response.json()
            return { error: errorData.message || `Error en la petición: ${response.status} ${response.statusText}` };
        }
        const journal = await response.json()
        return journal;

    } catch (error) {
        console.error("Error al crear el reading journal:", error);
        return { error: "Ocurrió un error inesperado" };
    }
}


export const createJournal = async (bodyParam) => {
    try {
        const response = await fetch('http://localhost:9000/journal/create', {
            method: 'POST',
            body: bodyParam,
        });
        if (!response.ok) {
            console.log(response);

            const errorData = await response.json()
            return { error: errorData.message || `Error en la petición: ${response.status} ${response.statusText}` };
        }
        const bookCreated = await response.json()
        return bookCreated;

    } catch (error) {
        console.error("Error al crear el reading journal:", error);
        return { error: "Ocurrió un error inesperado" };
    }
}