import express from 'express'
import { createJournal, deleteJournal, getAllJournals, getJournal, updateJournal } from '../controllers/journalController.js'
import { upload } from '../middlewares/multer.js'

const journalRouter = express.Router()

journalRouter.get('/getAllJournals', getAllJournals)
journalRouter.get('/getJournal', getJournal)
journalRouter.post('/create', upload.none(), createJournal)
journalRouter.put('/:id', upload.none(), updateJournal)
journalRouter.delete('/:id', deleteJournal)

export default journalRouter