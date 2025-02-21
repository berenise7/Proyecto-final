import fs from 'fs'
import cloudinary from "../config/cloudinary.js";
import booksDB from "../mocks/booksDB.js";
import bookModel from "../models/book.js";

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

// Create Book
// Subir una imagen a Cloudinary
const uploadImageToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(file.path, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result.secure_url)
            }
        })
    })
};

const createBook = async (req, res) => {
    try {
        const results = await cloudinary.uploader.upload(req.file.path);
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
            url: bookData.url
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
    loadDataBooks, getBooks, getIdBooks, createBook
}