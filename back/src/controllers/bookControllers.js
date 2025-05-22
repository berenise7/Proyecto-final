import fs from 'fs'
import cloudinary from "../config/cloudinary.js";
import bookModel from "../models/Book.js";

// GET all books
const getBooks = async (req, res) => {
    try {
        // Obtiene los parámetros de la query
        let { sortBy, page = 1, genre } = req.query;
        // Limitie de libros por página
        let limit = 21;
        let skip = (page - 1) * limit;

        let sortQuery = {};

        // Define el tipo de orden segun el valor de sortBy
        switch (sortBy) {
            case "newest":
                sortQuery = { createdAt: -1 }
                break;
            case "oldest":
                sortQuery = { createdAt: 1 }
                break;
            case "title_asc":
                sortQuery = { title: 1 }
                break;
            case "title_desc":
                sortQuery = { title: -1 }
                break;
            case "editorial_asc":
                sortQuery = { editorial: 1 }
                break;
            case "editorial_desc":
                sortQuery = { editorial: -1 }
                break;

            default:
                sortQuery = {}
                break;
        }

        let filterQuery = {};
        // Si se para un género por query, se filtra ese género
        if (genre) {
            filterQuery = { genres: genre };
        }

        // Obtener todos los libros
        const books = await bookModel.find(filterQuery).sort(sortQuery).skip(skip).limit(limit);

        // Total de libros
        const totalBooks = await bookModel.countDocuments(filterQuery);

        // Verificar si se encontraron libros
        if (books.length === 0) {
            return res.status(404).json({
                status: "failed",
                message: "No se encontraron libros.",
            });
        }

        // Enviar los libros encontrados como respuesta
        res.status(200).json({
            status: "Succeeded",
            data: books,
            totalPages: Math.ceil(totalBooks / limit), //total de las paginas
            currentPage: Number(page),
            error: null,
        });
    } catch (error) {
        // Manejar errores
        res.status(500).json({
            status: "failed",
            message: "Hubo un problema al obtener los libros.",
            error: error.message,
        });
    }
};

//GET Filtrado por bestSeller, isNewBook o isRecommendation
const getBooksFilter = async (req, res) => {
    try {
        // Obtiene los parámetros de la query
        const { bestSeller, isNewBook, isRecommendation } = req.query;

        // Maximo 15 libros
        const limit = 15;
        const filter = {};
        if (bestSeller !== undefined) {
            filter.bestSeller = bestSeller === "true"
        }
        if (isNewBook !== undefined) {
            filter.isNewBook = isNewBook === "true"
        }
        if (isRecommendation !== undefined) {
            filter.isRecommendation = isRecommendation === "true"
        }

        // Obtiene los libros filtrados, ordenados por los mas nuevos primero y con el límite
        const books = await bookModel.find(filter).sort({ createdAt: -1 }).limit(limit)
        // Enviar los libros encontrados como respuesta
        res.status(200).json({
            status: "Succeeded",
            data: books,
            error: null,
        });
    } catch (error) {
        // Manejar errores
        res.status(500).json({
            status: "failed",
            message: "Hubo un problema al obtener los libros.",
            error: error.message,
        });
    }
}


// GET book por id
const getIdBooks = async (req, res) => {
    try {
        // Para obtener el id de la URL
        const { id } = req.params;
        // Buscar el libro en la BD
        const book = await bookModel.findById(id)

        // Verificar si se encontró el libro
        if (!book) {
            return res.status(404).json({
                status: "failed",
                message: "Libro no encontrado.",
            });
        }

        // Envia el libro por su id como respuesta
        res.status(200).json({
            status: "Succeeded",
            data: book,
            error: null,
        });
    } catch (error) {
        // Manejar errores
        res.status(500).json({
            status: "failed",
            message: "Hubo un problema al obtener los libros.",
            error: error.message,
        });
    }
};

// GET para los libros favoritos
const getAllBooksByIds = async (req, res) => {
    try {
        // Paginación con un limite de 21
        const { page = 1 } = req.query;
        const limit = 21;
        let skip = (page - 1) * limit;

        // Obtiene los id de los libros favoritos
        const { bookIds } = req.body;
        if (!bookIds || bookIds.length === 0) {
            return res.status(400).json({ message: "No hay libros favoritos" });
        }


        // Obtiene los libros ordenados por los mas nuevos primero y aplicando la paginacion
        const favoriteBooks = await bookModel.find({ _id: { $in: bookIds } }).sort({ createdAt: -1 }).skip(skip).limit(limit);

        // Total de libros favoritos
        const totalFavorites = await bookModel.countDocuments({ _id: { $in: bookIds } })

        // Envia los libros favoritos y la paginacion
        res.status(200).json({
            status: "Succeeded",
            data: favoriteBooks,
            totalPages: Math.ceil(totalFavorites / limit),
            currentPage: Number(page),
            error: null,
        });
    } catch (error) {
        // Manejar errores
        res.status(500).json({
            status: "failed",
            message: "Hubo un problema al obtener los libros favoritos.",
            error: error.message,
        });
    }
}

// Elimina los acentos y lo combierte en minusculas
const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

//GET Busqueda de libros 
const getSearchBooks = async (req, res) => {
    try {
        // Obtiene la busqueda desde la query
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({
                status: "Failed",
                data: null,
                error: "Query is required",
            })
        }
        // Para eliminar las tildes y poner en minnusculas
        const normalizedQuery = removeAccents(query)

        // Busca los libros que coincidan
        const booksRegexSearch = await bookModel.find({
            $or: [
                { searchField: { $regex: normalizedQuery, $options: "i" } },
            ],
        });

        // Devuelve los libros encontrados
        res.status(200).json({
            status: "Succeeded",
            data: booksRegexSearch,
            error: null,
        });

    } catch (error) {
        // Manejar errores
        res.status(500).json({
            status: "Failed",
            data: null,
            error: error.message,
        });
    }
}


// Cambiar a minuscula y los espacios por "-"
const formatTitleForURL = (title) => {
    return title.toLowerCase().split(" ").join("-");
};

//POST Crear nuevo libro
const createBook = async (req, res) => {

    try {
        // Subir imagen a Cloudinary (si hay una imagen)
        let urlCloudinary = "";
        // Si hay un  archivo se sube la imagen a Cloudinary
        if (req.file) {
            try {
                const results = await cloudinary.uploader.upload(req.file.path);
                urlCloudinary = cloudinary.url(results.public_id, {
                    transformation: [{ quality: "auto", fetch_format: "auto" }]
                });

                // Eliminar la imagen subida localmente de forma asíncrona
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error("Error al eliminar el archivo:", err);
                });
            } catch (error) {
                // Si hay un fallo en la subida devuelve un error
                return res.status(500).json({ message: "Error subiendo la imagen." });
            }
        }

        // Obtiene los datos del nuevo libro mediante el body
        const bookData = req.body;

        // Verifica si existe ese libro mediante el isbn
        const book = await bookModel.findOne({ isbn: bookData.isbn })
        if (book) {
            return res.status(400).json({ message: `Ya existe un libro con este ISBN: ${bookData.isbn}` })
        }

        // Prepara el nuevo libro con los datos recibidos
        const newBook = new bookModel({
            title: bookData.title,
            author: bookData.author,
            isbn: bookData.isbn,
            genres: bookData.genres,
            editorial: bookData.editorial,
            description: bookData.description,
            price: bookData.price,
            quantity: bookData.quantity,
            image: urlCloudinary,
            isNewBook: bookData.isNewBook,
            isPresale: bookData.isPresale,
            bestSeller: bookData.bestSeller,
            isRecommendation: bookData.isRecommendation,
            url: `/books/${formatTitleForURL(bookData.title)}`,
            searchField: `${removeAccents(bookData.title)} - ${removeAccents(bookData.author)} - ${removeAccents([].concat(bookData.genres).join(" "))} - ${bookData.isbn}`

        });

        // Guardamos el nuevo libro
        await newBook.save();
        // Devuelve el nuevo libro
        res.status(200).json({
            status: "Succeeded",
            data: newBook,
            error: null,
        });
    } catch (error) {
        // Manejar errores
        res
            .status(500)
            .json({ status: "failed", data: null, error: error.message });
    }
}

// DELETE libros
const deleteBook = async (req, res) => {
    try {
        // Obtiene el id del libro mediante parámetros
        const { id } = req.params;
        // Verifica si existe el libro
        const book = await bookModel.findById(id)
        if (!book) {
            return res.status(404).json({
                status: "Failed",
                data: null,
                error: "Libro no encontrado"
            })
        }
        //  Elimina el libro mediante el id
        await bookModel.findByIdAndDelete(id)

        // Devuelve una respuesta exitosa sin datos
        res.status(200).json({
            status: "Succeeded",
            data: null,
            error: null
        })
    } catch (error) {
        // Manejar errores
        res
            .status(500)
            .json({ status: "failed", data: null, error: error.message });
    }
}

// PUT actualizar el libro por ID
const updateBook = async (req, res) => {
    try {
        // Obtiene el id del libro mediante parámetros
        const { id } = req.params;
        // Verifica si existe el libro
        const book = await bookModel.findById(id);
        if (!book) {
            return res.status(404).json({ message: `No se encontró un libro con el ID: ${id}` });
        }

        // Mantiene la imagen actual
        let urlCloudinary = book.image
        // Si hay una nueva imagen, se sube a Cloudinary
        if (req.file) {
            try {
                const results = await cloudinary.uploader.upload(req.file.path);
                urlCloudinary = cloudinary.url(results.public_id, {
                    transformation: [{ quality: "auto", fetch_format: "auto" }]
                });

                // Eliminar la imagen subida localmente de forma asíncrona
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error("Error al eliminar el archivo:", err);
                });
            } catch (error) {
                // Si hay un fallo en la subida devuelve un error
                return res.status(500).json({ message: "Error subiendo la imagen." });
            }
        }


        // Obtiene los nuevos datos mediante el body
        const bookData = req.body;
        // Actualiza el libro con los nuevos datos
        const updatedBook = await bookModel.findByIdAndUpdate(
            id,
            {
                title: bookData.title,
                author: bookData.author,
                genres: bookData.genres,
                editorial: bookData.editorial,
                description: bookData.description,
                price: bookData.price,
                quantity: bookData.quantity,
                image: urlCloudinary,
                isNewBook: bookData.isNewBook,
                isPresale: bookData.isPresale,
                bestSeller: bookData.bestSeller,
                isRecommendation: bookData.isRecommendation,
                url: `/books/${formatTitleForURL(bookData.title)}`,
                searchField: `${removeAccents(bookData.title)} - ${removeAccents(bookData.author)} - ${removeAccents([].concat(bookData.genres).join(" "))} - ${bookData.isbn}`
            },
            { new: true } // Para que devuelva el libro actualizado
        );

        // Devuelve el libro actualizado
        res.status(200).json({
            status: "Succeeded",
            data: updatedBook,
            error: null,
        });
    } catch (error) {
        // Manejar errores
        res.status(500).json({ status: "failed", data: null, error: error.message });
    }
}


export {
    getBooks, getBooksFilter, getIdBooks, createBook, getSearchBooks, updateBook, deleteBook, getAllBooksByIds
}