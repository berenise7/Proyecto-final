import { loadDataUsers, login } from "../controllers/userControllers.js";
import express from 'express'

const userRouter = express.Router()


userRouter.post("/login", login)
// userRouter.get('/loadDataUser', loadDataUsers)

export default userRouter