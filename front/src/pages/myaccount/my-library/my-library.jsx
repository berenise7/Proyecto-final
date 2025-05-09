import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faTrashCan,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./mylibrary.module.css";
import HeaderAndSearch from "@/components/Header/HeaderAndSearch";
import { deleteJournal, getAllJournals } from "@/api/journalFetch";
import Footer from "@/components/Footer/Footer";

export default function MyLibrary() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [journals, setJournals] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [journalToDelete, setJournalToDelete] = useState(null);

  const storedUser =
    typeof window !== "undefined" &&
    (localStorage.getItem("user") || sessionStorage.getItem("user"));
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token || !user) {
      router.push("/user/login"); // Redirige al login si no está autenticado
    } else {
      setIsAuth(true);
    }
  }, [router]);

  useEffect(() => {
    const fetchJournals = async () => {
      const journalsData = await getAllJournals(user._id, currentPage);
      console.log(journalsData);

      if (journalsData) {
        setJournals(journalsData.data);
        setTotalPages(journalsData.totalPages);
      } else {
        console.error("La respuesta no es un array", journalsData);
      }
    };
    fetchJournals();
  }, [currentPage]);
  if (!isAuth) {
    return <p>Cargando...</p>; // Muestra un mensaje mientras se verifica el login
  }

  const formatTitleForURL = (title) => {
    return title.toLowerCase().split(" ").join("-");
  };

  const goBack = () => {
    router.back();
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const openModal = (journal) => {
    setJournalToDelete(journal);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setJournalToDelete(null);
  };

  const confirmDelete = async () => {
    if (!journalToDelete) return;
    try {
      const response = await deleteJournal(journalToDelete._id);

      if (response.status === "Succeeded") {
        setJournals((prevJournals) =>
          prevJournals.filter((journal) => journal._id !== journalToDelete._id)
        );
      } else {
        console.error(
          "Error al eliminar el journal en el backend:",
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
      <div className={styles.container}>
        <a className="back" onClick={goBack}>
          <FontAwesomeIcon icon={faChevronLeft} /> Volver atras
        </a>
        <h2>Mis Lecturas terminadas</h2>
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
        {!journals ? (
          <p>No tienes ningun libro terminado</p>
        ) : (
          <div className={styles.readingGrid}>
            {Array.isArray(journals) && journals.length > 0
              ? journals.map((journal) => (
                  <div className={styles.card} key={journal.id}>
                    <Link
                      className={styles.link}
                      href={`/reading-journal/${formatTitleForURL(
                        journal.title
                      )}/${journal.book_id}`}
                    >
                      <img src={journal.image} alt={journal.title} />
                      <h3>{journal.title}</h3>
                    </Link>
                    <div className={styles.actions}>
                      <button onClick={() => openModal(journal)}>
                        <FontAwesomeIcon icon={faTrashCan} />
                      </button>
                    </div>
                  </div>
                ))
              : ""}
          </div>
        )}
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
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={closeModal}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h3>
              ¿Estás seguro de que quieres eliminar "{journalToDelete?.title}"?
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
