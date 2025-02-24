import fs from 'fs'
import cloudinary from "../config/cloudinary.js";
import booksDB from "../mocks/booksDB.js";
import bookModel from "../models/book.js";
import { log } from 'console';

// Get all books
const getBooks = async (req, res) => {
    try {
        // Obtener todos los libros
        const allBooks = await bookModel.find();

        // Verificar si se encontraron libros
        if (allBooks.length === 0) {
            return res.status(404).json({
                status: "failed",
                message: "No se encontraron libros.",
            });
        }

        // Enviar los libros encontrados como respuesta
        res.status(200).json({
            status: "Succeeded",
            data: allBooks,
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

// Get book por id
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

const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

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
                { title: { $regex: normalizedQuery, $options: "i" } },
                { author: { $regex: normalizedQuery, $options: "i" } },
                { isbn: { $regex: normalizedQuery, $options: "i" } },
            ],
        });
        // Si no hay resultados, intentar una búsqueda con $regex para coincidencias parciales
        if (booksRegexSearch.length === 0) {
            const booksTextSearch = await bookModel.find({
                $text: { $search: normalizedQuery },
            }).limit(5);

            // Si aún no hay resultados, devuelve un mensaje de error
            if (booksTextSearch.length === 0) {
                return res.status(404).json({
                    status: "Failed",
                    message: "No se encontraron libros que coincidan con la búsqueda.",
                    data: null,
                    error: null,
                });
            }
            // Si se encuentran resultados con $regex
            return res.status(200).json({
                status: "Succeeded",
                data: booksTextSearch,
                error: null,
            });
        }

        res.status(200).json({
            status: "Succeeded",
            data: booksRegexSearch,
            error: null,
        });

    } catch (error) {
        res.status(500).json({
            status: "Failed",
            data: null,
            error: "Error searching books",
        });
    }
}


// Crear nuevo libro
const formatTitleForURL = (title) => {
    return title.toLowerCase().split(" ").join("-");
};


const createBook = async (req, res) => {
    try {
        // Sube el file a cloudinary
        const results = await cloudinary.uploader.upload(req.file.path);
        // Y lo convierte en un url
        const urlCloudinary = cloudinary.url(results.public_id, {
            transformation: [
                {
                    quality: "auto",
                    fetch_format: "auto"
                }
            ]
        })


        // Elimina la imagen subida a uploads
        fs.unlinkSync(req.file.path)

        const bookData = req.body;

        const newBook = new bookModel({
            title: bookData.title,
            author: bookData.author,
            isbn: bookData.isbn,
            genre: bookData.genre,
            editorial: bookData.editorial,
            description: bookData.description,
            price: bookData.price,
            quantity: bookData.quantity,
            image: urlCloudinary,
            isNewBook: bookData.isNewBook,
            isPresale: bookData.isPresale,
            bestSeller: bookData.bestSeller,
            isRecommendation: bookData.isRecommendation,
            url: `/books/${formatTitleForURL(bookData.title)}`
        });
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
                ratings: Array.isArray(book.ratings) && book.ratings.length > 0 ? book.ratings : [1], // Validación aquí
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
    loadDataBooks, getBooks, getIdBooks, createBook, getSearchBooks
}