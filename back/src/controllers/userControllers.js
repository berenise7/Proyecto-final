import fs from 'fs'
import cloudinary from "../config/cloudinary.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import usersDB from '../mocks/usersDB.js';
import userModel from '../models/user.js';
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
                    userId: user._id,
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
    loadDataUsers, login
}