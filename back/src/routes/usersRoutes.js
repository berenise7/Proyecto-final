import { addFavoriteBook, deleteUser, editProfile, forgotPassword, getSearchUser, getUsers, loadDataUsers, login, registerUser, removeFavoriteBook, resetPassword, updateUserRole } from "../controllers/userControllers.js";
import express from 'express'
import authMiddleware from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multer.js";

const userRouter = express.Router();

// Rutas
// Autenticación y recuperación de contraseña
userRouter.post("/login", login);
userRouter.post("/register", upload.single("file"), registerUser);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password', resetPassword);

// Perfil de usuario
userRouter.get('/', authMiddleware, getUsers);
userRouter.get('/search', authMiddleware, getSearchUser)
userRouter.put("/profile", authMiddleware, upload.single("file"), editProfile);
userRouter.put('/new-role', authMiddleware, updateUserRole);
userRouter.delete('/delete-user', authMiddleware, deleteUser)

// Favoritos
userRouter.post("/favorites", authMiddleware, addFavoriteBook);
userRouter.delete("/favorites", authMiddleware, removeFavoriteBook);

// Carga inicial de usuarios (solo si se necesita)
// userRouter.get('/loadDataUser', loadDataUsers)

export default userRouter