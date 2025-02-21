import { createBook, getBooks, getIdBooks, loadDataBooks } from "../controllers/bookControlles.js";
import express from 'express'
import { upload } from "../middlewares/multer.js";

const bookRouter = express.Router()

bookRouter.get('/', getBooks)
bookRouter.get('/:id', getIdBooks)
bookRouter.post('/create', upload.single("file"), createBook)
// bookRouter.get('/loadDataBook', loadDataBooks)


export default bookRouter