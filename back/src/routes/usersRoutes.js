import { addFavoriteBook, editProfile, loadDataUsers, login, registerUser, removeFavoriteBook } from "../controllers/userControllers.js";
import express from 'express'
import authMiddleware from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multer.js";

const userRouter = express.Router();


userRouter.post("/login", login);
userRouter.post("/register", upload.single("file"), registerUser);
userRouter.post("/favorites", authMiddleware, addFavoriteBook);
userRouter.delete("/favorites", authMiddleware, removeFavoriteBook);
userRouter.put("/profile", authMiddleware, upload.single("file"), editProfile);
// userRouter.get('/loadDataUser', loadDataUsers)

export default userRouter