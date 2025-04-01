import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import styles from "./IdOrder.module.css";
import HeaderAndSearch from "@/components/Header/HeaderAndSearch";
import { getOrder } from "@/api/orderFetch";

export default function IdOrder() {
  const router = useRouter();
  const { _id } = router.query;

  const [order, setOrder] = useState(null);

  useEffect(() => {
    const loadOrder = async () => {
      const orderAux = await getOrder(_id);
      setOrder(orderAux?.data);
    };
    loadOrder();
  }, [_id]);
  console.log(order);
  const goBack = () => {
    router.back();
  };

  if (!order) {
    return (
      <>
        <HeaderAndSearch />
        <div className={styles.orderContainer}>
          <a className="back" onClick={goBack}>
            <FontAwesomeIcon icon={faChevronLeft} /> Volver atras
          </a>
          <h2>Pedido no encontrado</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <HeaderAndSearch />
      <div className={styles.orderContainer}>
        <a className="back" onClick={goBack}>
          <FontAwesomeIcon icon={faChevronLeft} /> Volver atras
        </a>
        <h2>Detalles del Pedido</h2>
        <p>
          <strong>ID del Pedido:</strong> {order._id}
        </p>
        <p>
          <strong>Fecha:</strong>{" "}
          {new Date(order.created_at).toLocaleDateString()}
        </p>
        <p>
          <strong>Estado:</strong> {order.status}
        </p>
        <p>
          <strong>Subtotal:</strong> {order.subtotal.toFixed(2)} €
        </p>

        <h3 className={styles.title}>Productos</h3>
        <ul>
          {order.books.map((book) => (
            <li key={book.book_id._id}>
             <img src={book.book_id.image} alt={book.book_id.title} className={styles.bookImage} />
              <div>
                <p><strong>{book.book_id.title}</strong></p>
                <p>{book.price.toFixed(2)} € x {book.quantity}</p>
              </div>
            </li>
          ))}
        </ul>

        <h3 className={styles.title}>Dirección de Envío</h3>
        <p>{order.full_name}</p>
        <p>
          {order.address}, {order.city}, {order.zip_code}, {order.country}
        </p>
        <p>
          <strong>Teléfono:</strong> {order.phone}
        </p>
      </div>
    </>
  );
}
