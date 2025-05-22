import { deleteBook, getAllBooks, searchBooks } from "@/api/booksFetch";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./allBooksEdits.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faTrashCan,
  faSearch,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import HeaderAndSearch from "@/components/Header/HeaderAndSearch";
import { useAuth } from "@/core/contexts/AuthContext";
import Footer from "@/components/Footer/Footer";

export default function allBooksEdits() {
  // uso de auth context
  const { user } = useAuth();

  // useRouter
  const router = useRouter();

  // useState
  const [books, setBooks] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookToDelete, setBookToDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // useEffect
  // Redirige si no es admin y carga libros si hay una búsqueda y sino obtiene todos los libros con paginación
  useEffect(() => {
    if (user?.rol !== "admin") {
      router.push("/");
    }
    const fetchBooks = async () => {
      if (searchQuery.length >= 3) {
        const searchResults = await searchBooks(searchQuery);
        setBooks(searchResults);
        setTotalPages(1);
      } else {
        const booksData = await getAllBooks(sortBy, currentPage);
        if (booksData) {
          setBooks(booksData.data);
          setTotalPages(booksData.totalPages);
        }
      }
    };
    fetchBooks();
  }, [user, router, sortBy, currentPage, searchQuery]);

  // Función para volver a la página anterior
  const goBack = () => {
    router.back();
  };

  // Actualiza el estado de búsqueda
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Cambia el filtro y reinicia a la página 1
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  // Para pasar a la página siguiente si no es la última
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Para pasar a la página anterior si no es la primera
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Abre el modal de confirmacion para eliminar un libro
  const openModal = (book) => {
    setBookToDelete(book);
    setIsModalOpen(true);
  };

  // Cierra el modal de confirmacion para eliminar un libro
  const closeModal = () => {
    setIsModalOpen(false);
    setBookToDelete(null);
  };

  // Confirma y ejecuta la eliminación de un libro
  const confirmDelete = async () => {
    if (!bookToDelete) return;
    try {
      const response = await deleteBook(bookToDelete._id);
      if (response.status === "Succeeded") {
        setBooks((prevBooks) =>
          prevBooks.filter((book) => book._id !== bookToDelete._id)
        );
      } else {
        console.error(
          "Error al eliminar el libro en el backend:",
          response.error
        );
      }
    } catch (error) {
      console.log("Error al eliminar el libro:", error);
    }
    closeModal();
  };

  return (
    <>
      <HeaderAndSearch />
      <div className={styles.booksContainer}>
        <a className="back" onClick={goBack}>
          <FontAwesomeIcon icon={faChevronLeft} /> Volver atras
        </a>
        <h2>Todos los Libros</h2>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Buscar libros..."
            value={searchQuery}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
          <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
        </div>
        <div className={styles.selectAndPagination}>
          {/* Filtrado */}
          <select
            onChange={handleSortChange}
            value={sortBy}
            className={styles.select}
          >
            <option value="">Ordernar por...</option>
            <option value="newest">Más recientes</option>
            <option value="oldest">Más antiguos</option>
            <option value="title_asc">Título (A-Z)</option>
            <option value="title_desc">Título (Z-A)</option>
            <option value="editorial_asc">Editorial (A-Z)</option>
            <option value="editorial_desc">Editorial (Z-A)</option>
          </select>
          {/* Paginación */}
          <div className={styles.pagination}>
            <button onClick={goToPrevPage} disabled={currentPage === 1}>
              Anterior
            </button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </button>
          </div>
        </div>
        {/* Mapeado de libros */}
        <div className={styles.grid}>
          {Array.isArray(books) && books.length > 0 ? (
            books.map((book) => (
              <div className={styles.productCard} key={book.id}>
                <Link
                  href={`/admin/edit-books/${book._id}`}
                  className={styles.link}
                >
                  <div>
                    <img src={book.image} alt={book.title} />
                    {book.quantity >= 1 ? (
                      (book.isNewBook && (
                        <span className={styles.badge}>Nuevo</span>
                      )) ||
                      (book.isPresale && (
                        <span className={styles.badge}>Preventa</span>
                      ))
                    ) : (
                      <span className={styles.badge}>Sin stock</span>
                    )}
                    <h3>{book.title}</h3>
                    <p>{book.editorial}</p>
                  </div>
                </Link>
                <div className={styles.actions}>
                  <button onClick={() => openModal(book)}>
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>Ups.. al parecer no se ha encontrado ningún libro</p>
          )}
        </div>
        {/* Paginación */}
        <div className={styles.pagination}>
          <button onClick={goToPrevPage} disabled={currentPage === 1}>
            Anterior
          </button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <button onClick={goToNextPage} disabled={currentPage === totalPages}>
            Siguiente
          </button>
        </div>
      </div>
      <Footer />

      {/* Ventana modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={closeModal}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h3>
              ¿Estás seguro de que quieres eliminar "{bookToDelete?.title}"?
            </h3>
            <div className={styles.modalActions}>
              <button className={styles.confirmButton} onClick={confirmDelete}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
