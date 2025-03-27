import bookModel from "../models/Book.js";
import cartModel from "../models/Cart.js";
import userModel from "../models/User.js";

// Añade libros al carrito
const addBookToCart = async (req, res) => {
    try {
        const { userId, bookId, quantity } = req.body;

        // Si no esta logueado
        if (!userId) {
            return res.status(200).json({ message: "Guardar en localStorage" });
        }

        // Verifica que haya un usuario
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Verifica que exite el libro
        const book = await bookModel.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: "Libro no encontrado" });
        }

        // Busca el carrito del user
        let cart = await cartModel.findOne({ user_id: userId })

        // Si no hay carrito se crea uno nuevo
        if (!cart) {
            cart = new cartModel({
                user_id: userId,
                books: [{ book_id: bookId, quantity, price: book.price, total_price: book.price * quantity, }],
            })

        } else {
            // Busca si ya esta el libro en el carrito
            const existingBook = cart.books.find((item) => item.book_id.equals(bookId))
            if (existingBook) {
                existingBook.quantity += quantity;
                existingBook.total_price = existingBook.quantity * book.price;
            } else {
                cart.books.push({ book_id: bookId, quantity, price: book.price, total_price: book.price * quantity, })
            }

        }
        // Recalcula el subtotal
        cart.subtotal = cart.books.reduce((acc, item) => acc + item.total_price, 0);

        await cart.save();
        res.status(200).json({
            status: "Succeeded",
            data: cart,
            error: null,
        });
    } catch (error) {
        res.status(500).json({ status: "failed", data: null, error: error.message });
    }

}

// Obtener el carrito del usuario
const getCart = async (req, res) => {
    try {
        const { userId } = req.params;

        // Busca el carrito del usuario
        const cart = await cartModel.findOne({ user_id: userId }).populate("books.book_id")


        res.status(200).json({
            status: "Succeeded",
            data: cart,
            error: null,
        });
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: "Hubo un problema al obtener los libros.",
            error: error.message,
        });
    }
}

// Fusiona el carrito con localStorage
const mergeCart = async (req, res) => {
    try {
        const { userId, localCart } = req.body;

        // Si no esta logueado
        if (!userId) {
            return res.status(400).json({ message: "Se requiere un usuario logueado" });
        }

        // Verifica que localCart no este vacio
        if (!localCart || localCart.length === 0) {
            return res.status(200).json({ message: "El carrito local está vacío", data: null });
        }

        let cart = await cartModel.findOne({ user_id: userId })

        if (!cart && localCart.length > 0) {
            // Si el usuario no tiene carrito, se guarda el del localStorage
            cart = new cartModel({
                user_id: userId,
                books: localCart.map(item => ({
                    book_id: item._id,
                    quantity: item.quantity,
                    price: item.price,
                    total_price: item.price * item.quantity
                })),
                subtotal: localCart.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2),
            });
        } else if (cart && localCart.length > 0) {

            localCart.forEach(localItem => {

                const existingBook = cart.books.find(dbItem => dbItem.book_id.equals(localItem._id))

                if (!existingBook) {
                    cart.books.push({
                        book_id: localItem._id,
                        quantity: localItem.quantity,
                        price: localItem.price,
                        total_price: localItem.price * localItem.quantity
                    })
                }

            });
            cart.subtotal = cart.books.reduce((acc, item) => acc + item.total_price, 0).toFixed(2);
        }

        await cart.save();
        res.status(200).json({
            status: "Succeeded",
            data: cart,
            error: null,
        });
    } catch (error) {
        res.status(500).json({ status: "failed", data: null, error: error.message });
    }
}


const updateCartItem = async (req, res) => {
    try {
        const { userId, bookId, quantity } = req.body;


        const cart = await cartModel.findOne({ user_id: userId })
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        const bookInCart = cart.books.find(item => item.book_id.equals(bookId));
        if (!bookInCart) {
            return res.status(404).json({ message: "Libro no está en el carrito" });
        }

        if (quantity < 1) {
            cart.books = cart.books.filter(item => !item.book_id.equals(bookId));
        }
        bookInCart.quantity = quantity;
        bookInCart.total_price = bookInCart.quantity * bookInCart.price;

        cart.subtotal = cart.books.reduce((acc, item) => acc + item.total_price, 0).toFixed(2);

        await cart.save();
        res.status(200).json({
            status: "Succeeded",
            data: cart,
            error: null,
        });
    } catch (error) {
        res.status(500).json({ status: "failed", data: null, error: error.message });
    }
}

const removeBookFromCart = async (req, res) => {
    try {
        const { userId, bookId } = req.body;

        // Busca el carrito
        const cart = await cartModel.findOne({ user_id: userId })
        // Verifica si hay carrito
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        // Verifica si el libro esta en el carrito
        const bookExists = cart.books.some(item => item.book_id.equals(bookId));
        if (!bookExists) {
            return res.status(404).json({ message: "Libro no encontrado en el carrito" });
        }

        // Filtro para eliminar un libro
        cart.books = cart.books.filter(item => !item.book_id.equals(bookId));

        // Si el carrito esta vacio se elimina de cart
        if (cart.books.length === 0) {
            await cartModel.deleteOne({ _id: cart._id });
            return res.status(200).json({
                status: "Succeeded",
                data: null,
                error: null
            });
        }

        cart.subtotal = cart.books.reduce((acc, item) => acc + item.total_price, 0);

        await cart.save();
        res.status(200).json({
            status: "Succeeded",
            data: cart,
            error: null,
        });
    } catch (error) {
        res.status(500).json({ status: "failed", data: null, error: error.message });
    }
}
export {
    addBookToCart, getCart, mergeCart, updateCartItem, removeBookFromCart
}