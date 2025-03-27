// Obtener la informacion del archivo env
import dotenv from "dotenv"
import path from "path"
dotenv.config({ path: path.resolve("src", ".env") })
// Creacion api
// Importacion de rutas
import bookRouter from "./routes/booksRoutes.js";
import userRouter from "./routes/usersRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import orderRouter from "./routes/orderRoutes.js";


// Importamos el framework Express para crear y gestionar el servicio web
import express from 'express'

// Importamos el middleware CORS para permitir el acceso desde otros dominios
import cors from 'cors'

// Importamos moongose para interactuar con MongoDB
import mongoose from 'mongoose'


// Creamos una instancia
const app = express()
// Puerto para las solicitudes
const port = 9000

// URL de conexion a MongoDB Atlas
const url_mongo = process.env.DATABASE_URL

// Conectamos Mongoose a la base de datos usando la URL proporcionada
mongoose.connect(url_mongo)

// Guardamos la conexion en una variable para manejar eventos de conexion y errores
const db = mongoose.connection

// Evento que se ejecuta si hay un error al conectar a MongoDB
db.on('error', (error) => {
    console.log(`Error al conectar con mongo ${error}`);
})

// Evento que se ejecuta cuando la conexion a MongoDB se establece correctamente
db.on('connected', () => {
    console.log('Success connect');

})

// Evento que se ejecuta si la conexión a MongoDB se cierra o se interrumpe
db.on('disconnected', () => {
    console.log('Mongo is disconnected');

})

// Middleware 
app.use(express.json({ limit: "10mb" }))
app.use(cors())

// Rutas
app.use("/books", bookRouter)
app.use("/users", userRouter)
app.use("/cart", cartRouter)
app.use("/order", orderRouter)

// Iniciaos el servidor en el puerto especificado
app.listen(port, () => {
    // Mostramos un mensaje en la consola para indicar que el servidor esta corriendo
    console.log(`Example app listening on port ${port}`);

})
