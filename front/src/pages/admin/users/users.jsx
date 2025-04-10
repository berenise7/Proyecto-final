import HeaderAndSearch from "@/components/Header/HeaderAndSearch";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faSearch,
  faTrashCan,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import {
  deleteUser,
  getUsers,
  searchUsers,
  updateNewRole,
} from "@/api/usersFetch";
import styles from "./users.module.css";

export default function Users() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(null);
  const [changeRolMessage, setChangeRolMessage] = useState(false);

  useEffect(() => {
    const user =
      JSON.parse(localStorage.getItem("user")) ||
      JSON.parse(sessionStorage.getItem("user"));

    if (user?.rol !== "admin" || !user) {
      router.push("/user/login");
    }
    const fetchUsers = async () => {
      if (searchQuery.length > 0) {
        const searchResults = await searchUsers(searchQuery);
        setUsers(searchResults);
        setTotalPages(1);
      } else {
        const usersData = await getUsers(currentPage);
        if (usersData) {
          setUsers(usersData.data);
          setTotalPages(usersData.totalPages);
        }
      }
    };
    fetchUsers();
  }, [router, currentPage, searchQuery]);

  const goBack = () => {
    router.back();
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
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

  const handleRoleChange = async (userId, newRole) => {
    const result = await updateNewRole(userId, newRole);
    if (result && result.status === "Succeeded") {
      const updated = users.find((user) => user._id === userId);
      setUpdatedUser({ ...updated, rol: newRole });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, rol: newRole } : user
        )
      );
      setChangeRolMessage(true);
    } else {
      alert("Hubo un error al cambiar el rol.");
    }
  };

  const openModal = (user) => {
    setUserToDelete(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setUserToDelete(null);
    setShowSuccessMessage(true);
  };
  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      const result = await deleteUser(userToDelete._id);
      if (result && result.status === "Succeeded") {
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== userToDelete._id)
        );
      } else {
        console.error(
          "Error al eliminar el usuario en el backend:",
          response.error
        );
      }
    } catch (error) {
      console.log("Error al eliminar el usuario:", error);
    }
    closeModal();
  };
  return (
    <>
      <HeaderAndSearch />
      <div className={styles.usersContainer}>
        <a className="back" onClick={goBack}>
          <FontAwesomeIcon icon={faChevronLeft} /> Volver atras
        </a>
        <h2>Todos los usuarios</h2>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Buscar usuarios por nombre o email..."
            value={searchQuery}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
          <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
        </div>
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre y apellido</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(users) && users?.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>
                    {user.name} {user.lastname}
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <select
                      className={styles.roleSelect}
                      value={user.rol}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                    >
                      <option value="user">Usuario</option>
                      <option value="admin">Administrador</option>
                    </select>
                    {}
                  </td>
                  <td>
                    <button
                      className={styles.removeBtn}
                      onClick={() => openModal(user)}
                    >
                      {" "}
                      <FontAwesomeIcon icon={faTrashCan} size="lg" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className={styles.noUsers}>
                  No hay usuarios
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className={styles.pagination}>
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className={styles.paginationButton}
          >
            Anterior
          </button>
          <span className={styles.pageInfo}>
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={styles.paginationButton}
          >
            Siguiente
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={closeModal}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h3>
              ¿Estás seguro de que quieres eliminar{" "}
              <span className={styles.userId}> ID: {userToDelete._id}</span>,{" "}
              <span className={styles.userName}>
                {userToDelete?.name} {userToDelete?.lastname}
              </span>
              ?
            </h3>
            <div className={styles.modalActions}>
              <button className={styles.confirmButton} onClick={confirmDelete}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessMessage && (
        <div className={styles.successModal}>
          <div className={styles.successContent}>
            {<p>¡Se ha eliminado correctamente!</p>}
            <button onClick={() => setShowSuccessMessage(false)}>
              Aceptar
            </button>
          </div>
        </div>
      )}

      {changeRolMessage && (
        <div className={styles.successModal}>
          <div className={styles.successContent}>
            <p>
              El usuario{" "}
              <strong>
                {updatedUser.name} {updatedUser.lastname}
              </strong>{" "}
              con ID: <span className={styles.userId}>{updatedUser._id}</span>{" "}
              ahora es{" "}
              <strong>
                {updatedUser.rol === "admin" ? "Administrador" : "Usuario"}
              </strong>
              .
            </p>
            <button
              onClick={() => {
                setChangeRolMessage(false);
                setUpdatedUser(null);
              }}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
