import { editProfile, loadDataUsers, login, registerUser } from "../controllers/userControllers.js";
import express from 'express'
import authMiddleware from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multer.js";

const userRouter = express.Router()


userRouter.post("/login", login);
userRouter.post("/register", upload.single("file"), registerUser);
userRouter.put("/profile", authMiddleware, upload.single("file"), editProfile);
// userRouter.get('/loadDataUser', loadDataUsers)

export default userRouter