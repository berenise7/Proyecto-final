// Peticion para obtener toda la lista de libros
export const getAllBooks = async () => {
    try {
        // Peticion al back
        const response = await fetch('http://localhost:9000/books')
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

// Peticion para obtener un libro por id

export const getBook = async (_id) => {
    //  Peticion al back
    const response = await fetch(`http://localhost:9000/books/${_id}`)
    const book = await response.json()
    return book
};


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
        console.log(bodyParam);

        const response = await fetch('http://localhost:9000/books/create', {
            method: 'POST',

            body: bodyParam
        });
        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
        }
        const bookCreated = await response.json()
        return bookCreated;

    } catch (error) {
        console.error("Error al crear el libro:", error);
        throw error;
    }
}