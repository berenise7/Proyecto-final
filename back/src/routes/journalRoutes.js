import express from 'express'
import { createJournal, getJournal } from '../controllers/journalController.js'
import { upload } from '../middlewares/multer.js'

const journalRouter = express.Router()

journalRouter.get('/getJournal', getJournal)
journalRouter.post('/create', upload.none(), createJournal)

export default journalRouter