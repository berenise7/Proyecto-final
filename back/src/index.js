// Creacion api
// Importacion de rutas
import bookRouter from "./routes/booksRoutes.js";

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
const url_mongo = "mongodb+srv://rodriguezcuencaberenise:JIhy9VmaEa03NR5q@maincluster.4ipv5.mongodb.net/?retryWrites=true&w=majority&appName=MainCluster"

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

// Iniciaos el servidor en el puerto especificado
app.listen(port, () => {
    // Mostramos un mensaje en la consola para indicar que el servidor esta corriendo
    console.log(`Example app listening on port ${port}`);

})
