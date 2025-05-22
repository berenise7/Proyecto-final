import fs from 'fs'
import cloudinary from "../config/cloudinary.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import usersDB from '../mocks/usersDB.js';
import userModel from '../models/User.js';
import { generateToken } from '../core/utils/utils.js';
import { sendEmail } from "../services/emailServices.js";


// POST login 
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar si esxites el email en la base de datos
        const user = await userModel.findOne({ email: email })
        if (user) {
            const validPassword = await bcrypt.compare(password, user.password)
            // Creamos token
            if (validPassword) {
                const payload = {
                    _id: user._id,
                    name: user.name,
                    lastname: user.lastname,
                    phone: user.phone,
                    address: user.address,
                    email: user.email,
                    birthday: user.birthday,
                    rol: user.rol,
                    favoritesGenres: user.favoritesGenres,
                    photo: user.photo,
                    favorites: user.favorites,
                }
                const token = generateToken(payload, false);
                const token_refresh = generateToken(payload, true);

                res.status(200).json({
                    status: "Succeeded",
                    data: user,
                    token: token,
                    token_refresh: token_refresh
                });
            } else {
                return res.status(200).json({
                    status: "Error",
                    message: "Email y contraseña no coinciden",
                });
            }
        } else {
            return res
                .status(200)
                .json({ status: "Error", message: "Email y contraseña no coinciden" });
        }
    } catch (error) {
        res.status(400).json({
            status: "Error",
            message: "No se ha podido hacer login",
            error: error.message,
        });
    }
}

// POST recuperar contraseña
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: `No se encontró el usuario` });
        }

        // Token para la restauracion
        const resetToken = generateToken({ _id: user._id }, false)

        const resetLink = `http://localhost:3000/user/reset-password?token=${resetToken}`

        const emailContent = `
        <h3>Recuperación de contraseña</h3>
        <p>Hola ${user.name},</p>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Este enlace expirará en 15 minutos.</p>
        `;

        await sendEmail(user.email, 'Restablece tu contraseña en Literary Haven', emailContent);

        res.status(200).json({ message: 'Se ha enviado un correo para restaurar la contraseña' });
    } catch (error) {
        res.status(500).json({ message: 'Error al enviar el correo', error: error.message });
    }
}

// POST resetear contraseña
const resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword, confirmPassword } = req.body;


        if (!resetToken) {
            return res.status(400).json({ message: 'Token no proporcionado' });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Las contraseñas no coinciden' });
        }

        // Verificamos el resetRoken
        const decoded = jwt.verify(resetToken, process.env.TOKEN_SECRET);

        const userId = decoded._id;

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save()

        const payload = {
            _id: user._id,
            name: user.name,
            lastname: user.lastname,
            phone: user.phone,
            address: user.address,
            email: user.email,
            birthday: user.birthday,
            rol: user.rol,
            favoritesGenres: user.favoritesGenres,
            photo: user.photo,
            favorites: user.favorites,
        }
        const token = generateToken(payload, false);

        res.status(200).json({
            status: "Succeeded",
            data: user,
            token: token,
            error: null,
        });
    } catch (error) {
        return res.status(400).json({ message: 'Token inválido o expirado', error: error.message });
    }
}

// POST registro de un nuevo usuario
const registerUser = async (req, res) => {
    try {
        const { name, lastname, phone, address, email, confirmEmail, password, confirmPassword, birthday, favoritesGenres } = req.body;

        // Comprobacion si los email y las passwords coinciden
        if (email !== confirmEmail) {
            return res.status(400).json({ message: "Los correos electrónicos no coinciden." });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Las contraseñas no coinciden." });
        }

        // Comprobar si existe ya una cuenta con ese email
        const existingUser = await userModel.findOne({ email: email })
        if (existingUser) {
            return res.status(400).json({ message: "Ya existe una cuenta con ese email." });
        }

        // Subir imagen a Cloudinary (si hay una imagen)
        let urlCloudinary = "";
        if (req.file) {
            try {
                const results = await cloudinary.uploader.upload(req.file.path);
                urlCloudinary = cloudinary.url(results.public_id, {
                    transformation: [{ quality: "auto", fetch_format: "auto" }]
                });

                // Eliminar la imagen subida localmente de forma asíncrona
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error("Error al eliminar el archivo:", err);
                });
            } catch (error) {
                return res.status(500).json({ message: "Error subiendo la imagen." });
            }
        }

        // Crear nuevo usuario
        const newUser = new userModel({
            name: name,
            lastname: lastname,
            phone: phone,
            address: address,
            email: email,
            password: await bcrypt.hash(password, 10),
            birthday: birthday,
            favoritesGenres: favoritesGenres,
            photo: urlCloudinary,
        })


        await newUser.save()

        // Generar token
        const token = generateToken(newUser.toObject(), false);
        const token_refresh = generateToken(newUser.toObject(), true);

        res.status(200).json({
            status: "Succeeded",
            data: newUser,
            token: token,
            token_refresh: token_refresh,
            error: null,
        });
    } catch (error) {
        res
            .status(500)
            .json({ status: "failed", data: null, error: error.message });
    }
}

// PUT Editar perfil de usuario
const editProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await userModel.findById(userId);

        // Verifica si existe un usuario
        if (!user) {
            return res.status(404).json({ message: `No se encontró el usuario` });
        }


        // Subida de la imagen en cloudinary
        let urlCloudinary = user.photo
        if (req.file) {
            try {
                const results = await cloudinary.uploader.upload(req.file.path);
                urlCloudinary = cloudinary.url(results.public_id, {
                    transformation: [{ quality: "auto", fetch_format: "auto" }]
                });

                // Eliminar la imagen subida localmente de forma asíncrona
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error("Error al eliminar el archivo:", err);
                });
            } catch (error) {
                return res.status(500).json({ message: "Error subiendo la imagen." });
            }
        }


        const userData = req.body;

        if (userData.currentPassword && userData.newPassword) {

            const isMatch = await bcrypt.compare(userData.currentPassword, user.password);

            if (!isMatch) {
                return res.status(400).json({ message: "La contraseña actual es incorrecta" });
            }

            userData.password = await bcrypt.hash(userData.newPassword, 10);
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            {
                name: userData.name,
                lastname: userData.lastname,
                phone: userData.phone,
                address: userData.address,
                email: userData.email,
                birthday: userData.birthday,
                rol: userData.rol,
                favoritesGenres: userData.favoritesGenres,
                photo: urlCloudinary,
                ...(userData.password && { password: userData.password })
            },
            { new: true }
        )
        const token = generateToken(updatedUser.toObject(), false);
        const token_refresh = generateToken(updatedUser.toObject(), true);


        res.status(200).json({
            status: "Succeeded",
            data: updatedUser,
            token: token,
            token_refresh: token_refresh,
            error: null,
        });
    } catch (error) {
        res.status(500).json({ status: "failed", data: null, error: error.message });
    }

}

// GET obtención de usuarios
const getUsers = async (req, res) => {
    try {
        if (!req.user || req.user.rol !== "admin") {
            return res.status(403).json({ status: "Error", message: "Acceso denegado. No eres administrador." });
        }

        let { page = 1 } = req.query;
        const limit = 10;
        let skip = (page - 1) * limit;

        const users = await userModel.find({}, '-password').skip(skip).limit(limit)
        const totalUsers = await userModel.countDocuments({})
        res.status(200).json({
            status: "Succeeded",
            data: users,
            totalPages: Math.ceil(totalUsers / limit), //total de las paginas
            currentPage: Number(page),
            error: null,
        });
    } catch (error) {
        res.status(500).json({ status: "failed", data: null, error: error.message });
    }
}

// PUT Actualizar role del usuario
const updateUserRole = async (req, res) => {
    try {
        // Si no hay usuario o no es admin lanza error
        if (!req.user || req.user.rol !== "admin") {
            return res.status(403).json({ status: "Error", message: "Acceso denegado. No eres administrador." });
        }

        const { userId, newRole } = req.body;

        // Verifica si esxite el usuario
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Verifica si el rol es valido
        const validRoles = ["admin", "user"]
        if (!validRoles.includes(newRole)) {
            return res.status(400).json({ message: "Rol no válido" });
        }

        // Actualizamos el rol y lo guardamos
        user.rol = newRole;
        await user.save()

        // 
        res.status(200).json({
            status: "Succeeded",
            data: user,
            error: null,
        });
    } catch (error) {
        res.status(500).json({ status: "failed", data: null, error: error.message });
    }
}

// DELETE eliminar usuario
const deleteUser = async (req, res) => {
    try {
        if (!req.user || req.user.rol !== "admin") {
            return res.status(403).json({ status: "Error", message: "Acceso denegado. No eres administrador." });
        }
        const { userId } = req.body

        // Verifica si esxite el usuario
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        await userModel.findByIdAndDelete(userId)
        res.status(200).json({
            status: "Succeeded",
            data: null,
            error: null
        })
    } catch (error) {
        res
            .status(500)
            .json({ status: "failed", data: null, error: error.message });
    }
}

// Elimina acentos y lo pone en minúsculas
const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

// GET busqueda de usuarios
const getSearchUser = async (req, res) => {
    try {
        if (!req.user || req.user.rol !== "admin") {
            return res.status(403).json({ status: "Error", message: "Acceso denegado. No eres administrador." });
        }

        const { query } = req.query;

        if (!query) {
            return res.status(400).json({
                status: "Failed",
                data: null,
                error: "Query is required",
            })
        }

        // Para eliminar las tildes y poner en minnusculas
        const normalizedQuery = removeAccents(query);

        const usersRegexSearch = await userModel.find({
            $or: [
                { name: { $regex: normalizedQuery, $options: "i" } },
                { email: { $regex: normalizedQuery, $options: "i" } },
                { lastname: { $regex: normalizedQuery, $options: "i" } }
            ]
        })

        res.status(200).json({
            status: "Succeeded",
            data: usersRegexSearch,
            error: null,
        });
    } catch (error) {
        res.status(500).json({ status: "failed", data: null, error: error.message });
    }
}

// POST añadir libros a favoritos
const addFavoriteBook = async (req, res) => {
    try {

        const { userId, bookId } = req.body;

        // Verifica si esxiste el usuario
        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Verifica si el libro esta en favoritos
        const isAlreadyFavorite = user.favorites.some(fav => fav.book_id.equals(bookId));
        if (isAlreadyFavorite) {
            return res.status(400).json({ message: "El libro ya está en favoritos" });
        }
        // Agrega el libro
        user.favorites.push({ book_id: bookId });
        await user.save();

        // Generar token
        const token = generateToken(user.toObject(), false);
        const token_refresh = generateToken(user.toObject(), true);

        res.status(200).json({
            status: "Succeeded",
            data: user,
            token: token,
            token_refresh: token_refresh,
            error: null,
        });
    } catch (error) {
        res.status(500).json({ status: "failed", data: null, error: error.message });
    }
}

// DELETE eliminar un libro de favoritos
const removeFavoriteBook = async (req, res) => {
    try {
        const { userId, bookId } = req.body;

        // Verifica si esxiste el usuario
        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Filtra y elimina el libro
        const updatedFavorites = user.favorites.filter(fav => !fav.book_id.equals(bookId))

        if (updatedFavorites.length === user.favorites.length) {
            return res.status(400).json({ message: "El libro no estaba en favoritos" });
        }

        user.favorites = updatedFavorites;
        await user.save();

        // Generar token
        const token = generateToken(user.toObject(), false);
        const token_refresh = generateToken(user.toObject(), true);

        res.status(200).json({
            status: "Succeeded",
            data: user,
            token: token,
            token_refresh: token_refresh,
            error: null,
        });
    } catch (error) {
        res.status(500).json({ status: "failed", data: null, error: error.message });
    }

}

// GET añadir a la base de datos de usuarios de una lista
const loadDataUsers = async (req, res) => {
    try {
        const usersToSave = await Promise.all(
            usersDB.map(async (user) => {
                const hashedPassword = await bcrypt.hash(user.password, 10); // Encriptar la contraseña
                return new userModel({
                    name: user.name,
                    lastname: user.lastname,
                    phone: user.phone,
                    address: user.address,
                    email: user.email,
                    password: hashedPassword,
                    birthday: user.birthday,
                    rol: user.rol,
                    favoritesGenres: user.favoritesGenres,
                    photo: user.photo,
                    favorites: user.favorites,
                });
            })
        );


        await userModel.insertMany(usersToSave);
    } catch (error) {
        res
            .status(500)
            .json({ status: "failed", data: null, error: error.message });
    }
}


export {
    loadDataUsers, login, editProfile, registerUser, addFavoriteBook, removeFavoriteBook, getUsers, getSearchUser, updateUserRole, deleteUser, forgotPassword, resetPassword
}