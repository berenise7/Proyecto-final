import { createBook, deleteBook, getAllBooksByIds, getBooks, getBooksFilter, getIdBooks, getSearchBooks, updateBook } from "../controllers/bookControllers.js";
import express from 'express'
import { upload } from "../middlewares/multer.js";

const bookRouter = express.Router()

// Rutas
// Obtener libros
bookRouter.get('/', getBooks)
bookRouter.get('/filter', getBooksFilter)
bookRouter.get('/search', getSearchBooks)
bookRouter.post('/getFavorites', getAllBooksByIds)
bookRouter.get('/:id', getIdBooks)

// Crear y modificar libros (requiere archivo)
bookRouter.post('/create', upload.single("file"), createBook)
bookRouter.put('/:id', upload.single("file"), updateBook)

// Eliminar libro
bookRouter.delete('/:id', deleteBook)


export default bookRouter