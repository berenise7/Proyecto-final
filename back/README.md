# 📦 Literary Haven - Backend

Este repositorio contiene el backend del proyecto **Literary Haven**, una plataforma para amantes de la lectura donde pueden registrarse, explorar libros, escribir diarios de lectura, realizar pedidos y más.

Para el frontend visita el repositorio correspondiente:
🔗 [Literary Haven Frontend](https://github.com/berenise7/Proyecto-final/tree/main/front)

---

## ✨ Tecnologías Utilizadas

- **Node.js**
- **Express**
- **MongoDB (Mongoose)**
- **JWT (jsonwebtoken)**
- **bcrypt**
- **dotenv**
- **multer** y **cloudinary** para subida de imágenes
- **nodemailer** para envío de correos
- **cors**

---

## 📅 Requisitos Previos

- Tener instalado [Node.js](https://nodejs.org/)
- Tener una instancia de MongoDB funcionando (local o remota)

---

## ⚖️ Instalación

```bash
# Clona el repositorio
git clone https://github.com/berenise7/Proyecto-final.git
cd Proyecto-final/back

# Instala las dependencias
npm install

# Crea un archivo .env con tus variables de entorno
cp .env.example .env

# Ejecuta el servidor
npm run start
```

---

## 📁 Estructura Básica

```bash
back/
├── src/
│   ├── config/            # Configuración general (Cloudinary)
│   ├── controllers/       # Lógica principal de cada recurso (books, users, etc.)
│   ├── core/
│   │   └── utils/         # Funciones auxiliares o reutilizables
│   ├── middlewares/       # Middlewares personalizados
│   ├── mocks/             # Datos simulados para pruebas
│   ├── models/            # Esquemas de Mongoose
│   ├── routes/            # Definición de rutas API
│   ├── services/          # Lógica de servicios externos
│   │   └── templates/     # Plantillas para emails
│   ├── uploads/           # Archivos temporales subidos por Multer
│   ├── utils/             # Funciones auxiliares (email, cloudinary, etc.)
├── index.js               # Archivo de entrada del servidor
└──.env                    # Variables de entorno (ignorado en Git)
```

---

## 🔐 Variables de Entorno

Asegúrate de crear un archivo `.env` con las siguientes claves:

```
DATABASE_URL= tu_url_de_conexion_a_mongodb
API_KEY= tu_api_key_de_cloudinary
API_SECRET= tu_api_secret_de_cloudinary
TOKEN_SECRET= tu_token_secreto_para_jwt
TOKEN_SECRET_REFRESH= tu_token_secreto_para_refresh_jwt
```

---

## 🔄 Endpoints Principales

### 📖 Books

#### 📕 Estructura del documento `Books` (MongoDB)

```
{
  "_id": "67b47d5e2c8ca82d61a0a04f",
  "title": "Taming 7 (LOS CHICOS DE TOMMEN 5)",
  "isbn": "9788410298194",
  "author": "Chloe Walsh",
  "editorial": "Montena",
  "description": "Ella es el prototipo de chica jovial. Él es el gracioso de la clase...",
  "price": 18.95,
  "quantity": 25,
  "image": "https://res.cloudinary.com/dfamhpsoj/image/upload/v1739965218/taming_7_oivgyy.png",
  "isNewBook": false,
  "isPresale": false,
  "bestSeller": false,
  "isRecommendation": true,
  "url": "/books/taming-7-(los-chicos-de-tommen-5)",
  "genres": ["Drama", "Romance"],
  "searchField": "taming 7 (los chicos de tommen 5) - chloe walsh - drama romance - 9788410298194",
  "createdAt": "2025-02-27T10:42:43.132Z",
  "updatedAt": "2025-03-06T08:48:34.028Z",
}
```

#### 📕 Books Endpoints

- ##### 📖 Obtener libros

| Método | Ruta                  | Descripción                                  |
| ------ | --------------------- | -------------------------------------------- |
| GET    | `/books/`             | Obtener todos los libros                     |
| GET    | `/books/filter`       | Filtrar libros por criterios específicos     |
| GET    | `/books/search`       | Buscar libros por palabra clave              |
| POST   | `/books/getFavorites` | Obtener libros favoritos por un array de IDs |
| GET    | `/books/:id`          | Obtener un libro por su ID                   |

- ##### ✏️ Crear y actualizar libros

| Método | Ruta            | Descripción                   |
| ------ | --------------- | ----------------------------- |
| POST   | `/books/create` | Crear un nuevo libro          |
| PUT    | `/books/:id`    | Actualizar un libro existente |

- ##### 🗑️ Eliminar libros

| Método | Ruta         | Descripción              |
| ------ | ------------ | ------------------------ |
| DELETE | `/books/:id` | Eliminar un libro por ID |

---

### 🤵 Users

#### 👤 Estructura del documeto `Users` (MongoDB)

```
{
  "_id": { "$oid": "67c6eddbd78a6c99f548753f"},
  "name": "Berenise",
  "lastname": "rodriguez",
  "phone": "987654321",
  "address": "malaga",
  "email": "email@gmail.com",
  "password": "$2b$10$BqB3RKLSKZMKQJIwxtOZSufqBHQTKrtSob2avancIII86v4FgRSry",
  "birthday": {"$date": "1995-11-14T00:00:00.000Z"},
  "rol": "admin",
  "favoritesGenres": ["Fantasía","Thriller"],
  "photo": "",
  "favorites": [
    { "book_id": { "$oid": "67c1916cb2bf5c9692bab485" }},
    { "book_id": { "$oid": "67b47d5e2c8ca82d61a0a04d" }}
  ],
  "updatedAt": { "$date": "2025-04-08T10:29:10.812Z" }
}
```

#### 👤 Users Endpoints

- ##### 🔐 Autenticación y recuperación de contraseña

| Método | Ruta                                          | Descripción                                        |
| ------ | --------------------------------------------- | -------------------------------------------------- |
| POST   | `http://localhost:9000/users/login`           | Iniciar sesión con email y contraseña.             |
| POST   | `http://localhost:9000/users/register`        | Registrar un nuevo usuario (puede incluir avatar). |
| POST   | `http://localhost:9000/users/forgot-password` | Solicitar enlace para restablecer contraseña.      |
| POST   | `http://localhost:9000/users/reset-password`  | Cambiar la contraseña con el token recibido.       |

- ##### 🧾 Perfil de usuario

| Método | Ruta                                      | Descripción                                          |
| ------ | ----------------------------------------- | ---------------------------------------------------- |
| GET    | `http://localhost:9000/users/`            | Obtener todos los usuarios (requiere autenticación). |
| GET    | `http://localhost:9000/users/search`      | Buscar usuarios por nombre/email (autenticado).      |
| PUT    | `http://localhost:9000/users/profile`     | Editar el perfil del usuario (avatar incluido).      |
| PUT    | `http://localhost:9000/users/new-role`    | Actualizar el rol del usuario.                       |
| DELETE | `http://localhost:9000/users/delete-user` | Eliminar la cuenta del usuario autenticado.          |

- ##### ⭐ Favoritos

| Método | Ruta                                    | Descripción                                 |
| ------ | --------------------------------------- | ------------------------------------------- |
| POST   | `http://localhost:9000/users/favorites` | Añadir un libro a la lista de favoritos.    |
| DELETE | `http://localhost:9000/users/favorites` | Eliminar un libro de la lista de favoritos. |

---

### 📝 Reading Journal

#### 📓 Estructura del documento `Journals` (MongoDB)

```
{
  "_id": { "$oid": "680f436adfbf4e630e22a0d3" },
  "user_id": { "$oid": "67c6eddbd78a6c99f548753e" },
  "book_id": { "$oid": "67b47d5e2c8ca82d61a0a04d" },
  "image": "https://res.cloudinary.com/dfamhpsoj/image/upload/v1739965218/reina_de_sombras_doaj6v.png",
  "title": "Reina de Sombras (EDICIÓN LIMITADA)",
  "author": "Sarah J. Maas",
  "pages": 740,
  "start_date": { "$date": "2025-04-01T00:00:00.000Z" },
  "end_date": { "$date": "2025-04-06T00:00:00.000Z" },
  "format": "Fisico",
  "type": "saga",
  "rating": 5,
  "romantic": 3,
  "happy": 0,
  "sad": 3,
  "spicy": 0,
  "plot": 3,
  "characters": "Personaje 1, personaje 2",
  "playlist": "playlist 1",
  "favoriteMoments": "momento 1\r\nmomento 2",
  "createdAt": { "$date": "2025-04-28T08:59:22.597Z"},
  "updatedAt": { "$date": "2025-05-07T10:25:41.133Z" },
}
```

#### 📓 Journals Endpoints

- ##### 📥 Lectura de journals

| Método | Ruta                                           | Descripción                     |
| ------ | ---------------------------------------------- | ------------------------------- |
| GET    | `http://localhost:9000/journal/getAllJournals` | Obtener todos los journals.     |
| GET    | `http://localhost:9000/journal/getJournal`     | Obtener un journal específico . |

- ##### ✏️ Crear y actualizar journals

| Método | Ruta                                   | Descripción                      |
| ------ | -------------------------------------- | -------------------------------- |
| POST   | `http://localhost:9000/journal/create` | Crear un nuevo journal.          |
| PUT    | `http://localhost:9000/journal/:id`    | Actualizar un journal existente. |

- ##### ❌ Eliminar journals

| Método | Ruta                                | Descripción                    |
| ------ | ----------------------------------- | ------------------------------ |
| DELETE | `http://localhost:9000/journal/:id` | Eliminar un journal por su ID. |

---

### 🛒 Cart

#### 🛒 Estructura del documento `Cart` (MongoDB)

```
{
  "_id": { "$oid": "67da9bac53b826e9aadd181b" },
  "user_id": { "$oid": "67c6eddbd78a6c99f548753f" },
  "books": [
    {
      "book_id": { "$oid": "67b47d5e2c8ca82d61a0a04d"},
      "quantity": 1,
      "price": 26.55,
      "total_price": 26.55
    },
    {
      "book_id": { "$oid": "67bcb00ddf4d28770e24db67"},
      "quantity": 1,
      "price": 21.8,
      "total_price": 21.8
    },
    {
      "book_id": { "$oid": "67bcb06fdf4d28770e24db69" },
      "quantity": 1,
      "price": 22.7,
      "total_price": 22.7
    }
  ],
  "subtotal": 71.05,
  "state": "abierto",
  "creation_date": { "$date": "2025-03-19T10:25:48.292Z" },
}
```

#### 🛒 Cart Endpoints

- ##### 📥 Obtener carrito

| Método | Ruta                                 | Descripción                                 |
| ------ | ------------------------------------ | ------------------------------------------- |
| GET    | `http://localhost:9000/cart/:userId` | Obtener el carrito de un usuario por su ID. |

- ##### ➕ Añadir o actualizar productos

| Método | Ruta                                | Descripción                         |
| ------ | ----------------------------------- | ----------------------------------- |
| POST   | `http://localhost:9000/cart/add`    | Añadir un libro al carrito.         |
| PUT    | `http://localhost:9000/cart/update` | Actualizar la cantidad de un libro. |

- ##### ❌ Eliminar productos

| Método | Ruta                                | Descripción                    |
| ------ | ----------------------------------- | ------------------------------ |
| DELETE | `http://localhost:9000/cart/remove` | Eliminar un libro del carrito. |

- ##### 🔄 Fusionar carritos

| Método | Ruta                               | Descripción                                                                  |
| ------ | ---------------------------------- | ---------------------------------------------------------------------------- |
| POST   | `http://localhost:9000/cart/merge` | Fusionar un carrito temporal (de usuario no registrado) con uno persistente. |

---

### 📦 Orders

#### 📄 Estructura de los documentos orders y payments

- ##### 📋 Estructura del documento `Orders` (MongoDB)

```
{
  "_id": { "$oid": "67e3eed49a3401876aa06881" },
  "books": [
    { "book_id": { "$oid": "67bcb00ddf4d28770e24db67" },
      "quantity": 1,
      "price": 21.8,
      "total_price": 21.8
      }],
  "subtotal": 21.8,
  "full_name": "Berenise María Rodríguez Cuenca",
  "email": "rodriguezcuencaberenise@gmail.com",
  "phone": "123453453",
  "country": "España",
  "city": "Málaga",
  "address": "29010",
  "zip_code": "29010",
  "status": "completado",
  "created_at": { "$date": "2025-03-26T12:11:00.511Z" }
}
```

- ##### 📋 Estructura del documento `Payments` (MongoDB)

```
{
  "_id": { "$oid": "67e3eed49a3401876aa06883" },
  "order_id": { "$oid": "67e3eed49a3401876aa06881" },
  "user_id": null,
  "payment_method": "paypal",
  "status": "completado",
  "transaction_id": "SIM-3t4ry5c59",
  "created_at": { "$date": "2025-03-26T12:11:00.511Z" },
}
```

#### 🧾 Order Endpoints

- ##### ➕ Crear nueva orden y procesar pago

| Método | Ruta                                   | Descripción                                             |
| ------ | -------------------------------------- | ------------------------------------------------------- |
| POST   | `http://localhost:9000/order/`         | Listado de pedidos y pagos.                             |
| POST   | `http://localhost:9000/order/newOrder` | Crear una nueva orden y procesar el pago (alternativa). |

- ##### 📥 Obtener orden por ID

| Método | Ruta                              | Descripción                             |
| ------ | --------------------------------- | --------------------------------------- |
| GET    | `http://localhost:9000/order/:id` | Obtener una orden específica por su ID. |

---

## 🚫 Notas de Seguridad

- El archivo `.env` debe estar en `.gitignore` (verificado).
- Las contraseñas están cifradas con `bcrypt`.
- La autenticación se realiza mediante JWT.

---

## ✨ Autor

Desarrollado por **Berenise** como parte del proyecto final.

---

← [Volver al README principal](../README.md)
