import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado, token no proporcionado' });
    }

    try {
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.TOKEN_SECRET); // Primero intenta con TOKEN_SECRET
        } catch (error) {
            decoded = jwt.verify(token, process.env.TOKEN_SECRET_REFRESH); // Si falla, prueba con el refresh
        }
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido' });
    }
};

export default authMiddleware;