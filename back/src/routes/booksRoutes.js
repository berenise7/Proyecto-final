import { createBook, deleteBook, getBooks, getIdBooks, getSearchBooks, loadDataBooks, updateBook } from "../controllers/bookControllers.js";
import express from 'express'
import { upload } from "../middlewares/multer.js";

const bookRouter = express.Router()

bookRouter.get('/', getBooks)
bookRouter.post('/create', upload.single("file"), createBook)
bookRouter.get('/search', getSearchBooks)
bookRouter.get('/:id', getIdBooks)
bookRouter.put('/:id', upload.single("file"), updateBook)
bookRouter.delete('/:id', deleteBook)
// bookRouter.get('/loadDataBook', loadDataBooks)


export default bookRouter