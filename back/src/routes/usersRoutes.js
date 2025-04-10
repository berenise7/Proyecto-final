import { addFavoriteBook, deleteUser, editProfile, forgotPassword, getSearchUser, getUsers, loadDataUsers, login, registerUser, removeFavoriteBook, resetPassword, updateUserRole } from "../controllers/userControllers.js";
import express from 'express'
import authMiddleware from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multer.js";

const userRouter = express.Router();


userRouter.get('/', authMiddleware, getUsers);
userRouter.get('/search', authMiddleware, getSearchUser)
userRouter.post("/login", login);
userRouter.post("/register", upload.single("file"), registerUser);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password', resetPassword);
userRouter.post("/favorites", authMiddleware, addFavoriteBook);
userRouter.delete("/favorites", authMiddleware, removeFavoriteBook);
userRouter.put("/profile", authMiddleware, upload.single("file"), editProfile);
userRouter.put('/new-role', authMiddleware, updateUserRole);
userRouter.delete('/delete-user', authMiddleware, deleteUser)
// userRouter.get('/loadDataUser', loadDataUsers)

export default userRouter