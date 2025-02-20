import { getBooks, getIdBooks, loadDataBooks } from "../controllers/bookControlles.js";
import express from 'express'

const bookRouter = express.Router()

bookRouter.get('/', getBooks)
bookRouter.get('/:id', getIdBooks)
// bookRouter.get('/loadDataBook', loadDataBooks)


export default bookRouter