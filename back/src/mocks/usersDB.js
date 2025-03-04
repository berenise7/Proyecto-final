const usersDB = [
    {
        id: "1",
        name: "Bere",
        lastname: "Rodiguez Cuenca",
        phone: "123456789",
        address: "malaga",
        email: "rodriguezcuencaberenise@gmail.com",
        password: "Prueba123!",
        birthday: "1995-11-14",
        rol: "admin",
        favoritesGenres: ["Romance", "Fantasía", "Thriller"],
        photo: "",
        favorites: [
            { book_id: "67c1916cb2bf5c9692bab485" },
            { book_id: "67b47d5e2c8ca82d61a0a04f" },
        ],
    },
    {
        id: "2",
        name: "Rafael",
        lastname: "Castro Lopez",
        phone: "987654321",
        address: "malaga",
        email: "castrolopezrafael@gmail.com",
        password: "Prueba123!",
        birthday: "1997-11-27",
        rol: "user",
        favoritesGenres: ["Fantasía", "Thriller"],
        photo: "",
        favorites: [
            { book_id: "67c1916cb2bf5c9692bab485" }
        ],
    },
]

export default usersDB;