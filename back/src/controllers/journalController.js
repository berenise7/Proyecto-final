import fs from 'fs'
import cloudinary from "../config/cloudinary.js";
import journalModel from "../models/Journal.js";
import userModel from "../models/User.js";
import bookModel from "../models/Book.js"

const getJournal = async (req, res) => {
    try {
        const { bookId, userId } = req.query;
        
        if (!userId) {
            return res.status(404).json({ message: `No se encontró el usuario` });
        }
        if (!bookId) {
            return res.status(404).json({ message: `No se encontró el libro` });
        }

        const journal = await journalModel.findOne({ user_id: userId, book_id: bookId });

        
        if (!journal) {
            return res.status(404).json({ message: `No se encontró un Journal con esos datos.` });
        }

        res.status(200).json({
            status: "Succeeded",
            data: journal,
            error: null,
        });
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: "Hubo un problema al obtener el reading journal.",
            error: error.message,
        });
    }
}

const createJournal = async (req, res) => {
    try {
        const { bookId } = req.body
        // Verifica si esxite el libro
        if (!bookId) {
            return res.status(404).json({ message: `No se encontró el libro` });
        }
        // Verifica si existe en la base de datos
        const book = await bookModel.findById(bookId)
        if (!book) {
            return res.status(404).json({ message: `No se encontró el libro en la base de datos` });
        }

        const { userId } = req.body;
        if (!userId) {
            return res.status(404).json({ message: `No se encontró el usuario` });
        }
        // Verifica si existe un usuario
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: `No se encontró el usuario` });
        }

        const journalData = req.body;
        const newJournal = new journalModel({
            user_id: userId,
            book_id: bookId,
            title: book.title,
            author: book.author,
            image: book.image,
            pages: Number(journalData.pages),
            start_date: journalData.start_date,
            end_date: journalData.end_date,
            format: journalData.format,
            type: journalData.type,
            rating: Number(journalData.rating),
            romantic: Number(journalData.romantic),
            happy: Number(journalData.happy),
            sad: Number(journalData.sad),
            spicy: Number(journalData.spicy),
            plot: Number(journalData.plot),
            characters: journalData.characters,
            playlist: journalData.playlist,
            favoriteMoments: journalData.favoriteMoments,
        });

        await newJournal.save();

        res.status(200).json({
            status: "Succeeded",
            data: newJournal,
            error: null,
        });
    } catch (error) {
        res
            .status(500)
            .json({ status: "failed", data: null, error: error.message });
    }
}

export {
    getJournal, createJournal
}