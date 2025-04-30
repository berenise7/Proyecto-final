import { createBook, deleteBook, getAllBooksByIds, getBooks, getBooksFilter, getIdBooks, getSearchBooks, loadDataBooks, updateBook } from "../controllers/bookControllers.js";
import express from 'express'
import { upload } from "../middlewares/multer.js";

const bookRouter = express.Router()

bookRouter.get('/', getBooks)
bookRouter.get('/filter', getBooksFilter)
bookRouter.get('/search', getSearchBooks)
bookRouter.post('/getFavorites', getAllBooksByIds)
bookRouter.get('/:id', getIdBooks)
bookRouter.post('/create', upload.single("file"), createBook)
bookRouter.put('/:id', upload.single("file"), updateBook)
bookRouter.delete('/:id', deleteBook)
// bookRouter.get('/loadDataBook', loadDataBooks)


export default bookRouter