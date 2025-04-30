import fs from 'fs'
import cloudinary from "../config/cloudinary.js";
import booksDB from "../mocks/booksDB.js";
import bookModel from "../models/Book.js";

// GET all books
const getBooks = async (req, res) => {
    try {
        let { sortBy, page = 1, genre } = req.query;
        let limit = 21;
        let skip = (page - 1) * limit;

        let sortQuery = {};


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
        if (genre) {
            filterQuery = { genres: genre };
        }

        // Obtener todos los libros
        const books = await bookModel.find(filterQuery).sort(sortQuery).skip(skip).limit(limit);

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
        console.error(error);
        res.status(500).json({
            status: "failed",
            message: "Hubo un problema al obtener los libros.",
            error: error.message,
        });
    }
};

const getBooksFilter = async (req, res) => {
    try {
        const { bestSeller, isNewBook, isRecommendation } = req.query;

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


        const books = await bookModel.find(filter)
        res.status(200).json({
            status: "Succeeded",
            data: books,
            error: null,
        });
    } catch (error) {
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
        console.error(error);
        res.status(500).json({
            status: "failed",
            message: "Hubo un problema al obtener los libros.",
            error: error.message,
        });
    }
};


const getAllBooksByIds = async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const limit = 21;
        let skip = (page - 1) * limit;

        const { bookIds } = req.body;
        if (!bookIds || bookIds.length === 0) {
            return res.status(400).json({ message: "No hay libros favoritos" });
        }

        const favoriteBooks = await bookModel.find({ _id: { $in: bookIds } }).skip(skip).limit(limit);

        const totalFavorites = await bookModel.countDocuments({ _id: { $in: bookIds } })

        res.status(200).json({
            status: "Succeeded",
            data: favoriteBooks,
            totalPages: Math.ceil(totalFavorites / limit),
            currentPage: Number(page),
            error: null,
        });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los libros favoritos", error });
    }
}

// Elimina los acentos y lo combierte en minusculas
const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

//GET Busqueda de libros 
const getSearchBooks = async (req, res) => {
    try {
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


        const booksRegexSearch = await bookModel.find({
            $or: [
                { searchField: { $regex: normalizedQuery, $options: "i" } },
            ],
        });

        res.status(200).json({
            status: "Succeeded",
            data: booksRegexSearch,
            error: null,
        });

    } catch (error) {
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
                return res.status(500).json({ message: "Error subiendo la imagen." });
            }
        }

        const bookData = req.body;

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

        const book = await bookModel.findOne({ isbn: bookData.isbn })
        if (book) {
            return res.status(400).json({ message: `Ya existe un libro con este ISBN: ${bookData.isbn}` })
        }

        await newBook.save();

        res.status(200).json({
            status: "Succeeded",
            data: newBook,
            error: null,
        });
    } catch (error) {
        res
            .status(500)
            .json({ status: "failed", data: null, error: error.message });
    }
}

const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await bookModel.findById(id)

        if (!book) {
            return res.status(404).json({
                status: "Failed",
                data: null,
                error: "Libro no encontrado"
            })
        }

        await bookModel.findByIdAndDelete(id)
        res.status(200).json({
            status: "Succeeded",
            data: null,
            error: null
        })
    } catch (error) {
        res
            .status(500)
            .json({ status: "failed", data: null, error: error.message });
    }
}


const updateBook = async (req, res) => {
    try {
        const { id } = req.params;

        const book = await bookModel.findById(id);
        if (!book) {
            return res.status(404).json({ message: `No se encontró un libro con el ID: ${id}` });
        }

        let urlCloudinary = book.image
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
                return res.status(500).json({ message: "Error subiendo la imagen." });
            }
        }



        const bookData = req.body;
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
            { new: true }
        );

        res.status(200).json({
            status: "Succeeded",
            data: updatedBook,
            error: null,
        });
    } catch (error) {
        res.status(500).json({ status: "failed", data: null, error: error.message });
    }
}

// Load initial data
const loadDataBooks = async (req, res) => {
    try {
        booksDB.map(async (book) => {
            const newBook = bookModel({
                title: book.title,
                author: book.author,
                isbn: book.isbn,
                genre: book.genre,
                editorial: book.editorial,
                description: book.description,
                price: book.price,
                quantity: book.quantity,
                image: book.image,
                isNewBook: book.isNewBook,
                isPresale: book.isPresale,
                bestSeller: book.bestSeller,
                isRecommendation: book.isRecommendation,
                url: book.url
            });
            await newBook.save()
        });
        res.sendStatus(200)
    } catch (error) {
        res
            .status(500)
            .json({ status: "failed", data: null, error: error.message });
    }
};

export {
    loadDataBooks, getBooks, getBooksFilter, getIdBooks, createBook, getSearchBooks, updateBook, deleteBook, getAllBooksByIds
}