import fs from 'fs'
import cloudinary from "../config/cloudinary.js";
import bcrypt from 'bcrypt';
import usersDB from '../mocks/usersDB.js';
import userModel from '../models/User.js';
import { generateToken } from '../core/utils/utils.js';



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
    loadDataUsers, login, editProfile, registerUser, addFavoriteBook, removeFavoriteBook
}