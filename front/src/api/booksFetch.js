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