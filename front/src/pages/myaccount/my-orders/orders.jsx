import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { getOrderAndPayment } from "@/api/orderFetch";
import HeaderAndSearch from "@/components/Header/HeaderAndSearch";
import styles from "./orders.module.css";
import { useRouter } from "next/router";
import Footer from "@/components/Footer/Footer";

export default function orders() {
  // useRouter
  const router = useRouter();

  // useState
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // useEffect
  // Carga y ordena los pedidos del usuario por fecha más reciente al cambiar la página
  useEffect(() => {
    const fetchOrders = async () => {
      const user =
        JSON.parse(localStorage.getItem("user")) ||
        JSON.parse(sessionStorage.getItem("user"));
      const email = user.email;
      try {
        const ordersData = await getOrderAndPayment(email, currentPage);

        if (ordersData && ordersData.data) {
          // Ordenar los pedidos por fecha DESCENDENTE (más recientes primero)
          const sortedOrders = ordersData.data.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          setOrders(sortedOrders);
          setTotalPages(ordersData.totalPages);
        } else {
          console.error("La respuesta no es un array", ordersData.error);
        }
      } catch (error) {}
    };
    fetchOrders();
  }, [currentPage]);

  // Para volver a la página anterior
  const goBack = () => {
    router.back();
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

  return (
    <>
      <HeaderAndSearch />
      <div className={styles.orderContainer}>
        <a className="back" onClick={goBack}>
          <FontAwesomeIcon icon={faChevronLeft} /> Volver atras
        </a>
        <h2>Todos los pedidos</h2>
        <table className={styles.orderTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(orders) && orders?.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order._id}
                  onClick={() =>
                    router.push(`/myaccount/my-orders/${order._id}`)
                  }
                >
                  <td>{order._id}</td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>{order.status}</td>
                  <td>{order.subtotal.toFixed(2)} €</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className={styles.noOrders}>
                  No hay pedidos desponibles
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
      <Footer />
    </>
  );
}
