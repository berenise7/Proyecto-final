// Peticion para obtener toda la lista de libros
export const getAllBooks = async (sortBy = "", page = 1, genre = "") => {
    try {
        // Peticion al back
        const genreQuery = genre ? `&genre=${genre}` : "";
        const response = await fetch(`http://localhost:9000/books?sortBy=${sortBy}&page=${page}${genreQuery}`)
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`)
        }
        const books = await response.json()
        return books
    } catch (error) {
        console.log('Error fetching books,', error);
        return [];

    }
};

// Peticion para obtener los libros segun el filtro(bestSeller, isPresale o isRecommendation)
export const getBooksFilter = async (filter) => {
    try {
        const query = new URLSearchParams(filter).toString();
        const response = await fetch(`http://localhost:9000/books/filter?${query}`)

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

// Peticion para obtener un libro por id
export const getBook = async (_id) => {
    //  Peticion al back
    const response = await fetch(`http://localhost:9000/books/${_id}`)
    const book = await response.json()
    return book
};

export const getFavorites = async (favorites, page = 1) => {
    try {
        const response = await fetch(`http://localhost:9000/books/getFavorites?page=${page}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ bookIds: favorites }),
        });
        if (!response.ok) {
            throw new Error("Error al obtener los libros favoritos.");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al obtener libros favoritos:", error);
        throw error;
    }
}


export const searchBooks = async (query) => {
    if (!query || query.length < 3) return [];
    try {
        const res = await fetch(`http://localhost:9000/books/search?query=${encodeURIComponent(query)}`)
        const { status, data, error } = await res.json()
        if (status === "Succeeded") {
            return data;
        } else {
            console.log("Search error:", error);
            return [];
        }
    } catch (error) {
        console.log("Error fetching books", error);

    }
}

export const createBook = async (bodyParam) => {
    try {
        const response = await fetch('http://localhost:9000/books/create', {
            method: 'POST',
            body: bodyParam
        });
        if (!response.ok) {
            const errorData = await response.json()
            return { error: errorData.message || `Error en la petición: ${response.status} ${response.statusText}` };
        }
        const bookCreated = await response.json()
        return bookCreated;

    } catch (error) {
        console.error("Error al crear el libro:", error);
        return { error: "Ocurrió un error inesperado" };
    }
}

export const updateBook = async (_id, bodyParam) => {
    try {

        const response = await fetch(`http://localhost:9000/books/${_id}`, {
            method: 'PUT',
            body: bodyParam
        });

        if (!response.ok) {
            const errorData = await response.json()
            return { error: errorData.message || `Error en la petición: ${response.status} ${response.statusText}` };
        }
        const bookUpdated = await response.json()
        return bookUpdated;
    } catch (error) {
        console.error("Error al crear el libro:", error);
        return { error: "Ocurrió un error inesperado" };
    }
}

export const deleteBook = async (_id) => {
    try {
        const response = await fetch(`http://localhost:9000/books/${_id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error("No se pudo eliminar el libro")
        }
        return await response.json()
    } catch (error) {
        console.error("Error al eliminar el libro:", error);
        return { error: "Ocurrió un error inesperado" };
    }
}